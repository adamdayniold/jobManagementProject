import { useState, useCallback } from 'react';
import { Alert, Image, View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ProgressLoader from 'rn-progress-loader';

import { auth, db, storage } from '../../../../firebase';
import { getDocs, collection, addDoc, doc, updateDoc } from 'firebase/firestore';

import styles from './styles';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function ManagePICScreen(props) {
  const MARGINWITHIMAGESELECTED = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: '5%'
  };

  const MARGINWITHOUTIMAGESELECTED = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: '0%'
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [documentFileName, setDocumentFileName] = useState('');
  const [imageDownloadURL, setImageDownloadURL] = useState('');
  const [documentDownloadURL, setDocumentDownloadURL] = useState('');
  const [picName, setPicName] = useState('');
  const [description, setDescription] = useState('');
  const [dataUID, setDataUID] = useState('');
  const [isNewData, setIsNewData] = useState(false);
  const [isNewUploadedImage, setIsNewUploadedImage] = useState(false);
  const [isNewUploadedDocument, setIsNewUploadedDocument] = useState(false);
  const [userUID, setUserUID] = useState(null);
  const [removeOldImage, setRemoveOldImage] = useState(false);
  const [removeOldDoc, setRemoveOldDoc] = useState(false);
  const [oldImage, setOldImage] = useState(null);
  const [oldDoc, setOldDoc] = useState(null);
  const [docLogo, setDocumentLogo] = useState(styles.documentLogo);
  const [docContainer, setDocumentContainer] = useState(styles.documentSee);
  const [docFileType, setDocFileType] = useState('');

  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    const { isNew, data } = props.route.params;
    const userDetails = auth.currentUser;
    setUserUID(userDetails.uid);
    setIsNewData(isNew);
    if (isNew) {
      setIsNewUploadedDocument(true);
      setIsNewUploadedImage(true);
      setImage(null);
      setDocument(null);
      setImageFileName('');
      setDocumentFileName('');
      setImageDownloadURL('');
      setDocumentDownloadURL('');
      setPicName('');
      setDescription('');
    } else {
      if (data.documentNameRef) {
        const docFile = data.documentNameRef;
        const typeOfFile = docFile.split('.').pop();
        if (typeOfFile === 'pdf') {
          setDocumentLogo(styles.documentLogo);
          setDocumentContainer(styles.documentSee);
        } else {
          setDocumentLogo(styles.txtLogo);
          setDocumentContainer(styles.documentElseSee)
        }
        setDocFileType(typeOfFile.toUpperCase());
      }
      setIsNewUploadedDocument(data.documentNameRef && data.documentDownloadURL ? false : true);
      setIsNewUploadedImage(data.imageNameRef && data.imageDownloadURL ? false : true);
      setDataUID(data.id);
      setImage(data.imageDownloadURL);
      setDocument(data.documentDownloadURL);
      setImageFileName(data.imageNameRef);
      setDocumentFileName(data.documentNameRef);
      setImageDownloadURL(data.imageDownloadURL);
      setDocumentDownloadURL(data.documentDownloadURL);
      setPicName(data.picName);
      setDescription(data.description);
    }
    setIsLoading(false);
  }, []))

  const getUser = async (userUID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = {};
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach((doc) => {
            if (doc.data().uid === userUID) {
              list['name'] = doc.data().name;
              list['email'] = doc.data().email;
              list['company'] = doc.data().company;
              list['designation'] = doc.data().designation;
            }
          })
          resolve(list);
        }
      } catch (err) {
        console.error('Error fetching uploader information', err);
        resolve(false);
      }
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1
    })

    if (result && !result.canceled) {
      const fileName = result.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      const source = { uri: result.assets[0].uri, name: fileName, type: fileType };
      setImage(source);
    }
  }

  const replaceImage = () => {
    setRemoveOldImage(true);
    setOldImage(imageFileName);
    pickImage();
  }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result && !result.canceled) {
      if (result.mimeType === 'application/pdf') {
        setDocumentLogo(styles.documentLogo);
        setDocumentContainer(styles.documentSee);
      } else {
        setDocumentLogo(styles.txtLogo);
        setDocumentContainer(styles.documentElseSee)
      }
      const fileName = result.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      setDocFileType(fileType.toUpperCase());
      const source = { uri: result.uri, name: fileName, type: fileType };
      setDocument(source);
    }
  }

  const replaceDocument = () => {
    setRemoveOldDoc(true);
    setOldDoc(documentFileName);
    pickDocument();
  }

  const uploadImage = async () => {
    return new Promise(async (resolve, reject) => {
      const currentDate = new Date();
      const epoch = Date.parse(currentDate);
      const splitName = image.name.split('.');
      const imageName = splitName[0] + '-' + epoch + '.' + splitName[1];
      setImageFileName(imageName);
      if (image.uri) {
        try {
          const response = await fetch(image.uri);
          const blobFile = await response.blob();
          const storageRef = ref(storage, imageName);
          const result = await uploadBytes(storageRef, blobFile);
          const picDownloadURL = await getDownloadURL(ref(result.ref));
          setImageDownloadURL(picDownloadURL);
          resolve({ picDownloadURL, imageName });
        } catch (err) {
          console.error('Error uploading image', err);
          resolve(false);
        }
      }
    })
  }

  const removeImage = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const imageRef = ref(storage, oldImage);
        await deleteObject(imageRef);
        resolve(true);
      } catch (err) {
        console.error('Error deleting old image', err);
        resolve(false);
      }
    })
  }

  const uploadDocument = async () => {
    return new Promise(async (resolve, reject) => {
      const currentDate = new Date();
      const epoch = Date.parse(currentDate);
      const splitName = document.name.split('.');
      const documentName = splitName[0] + '-' + epoch + '.' + splitName[1];
      setDocumentFileName(documentName);
      if (document.uri) {
        try {
          const response = await fetch(document.uri);
          const blobFile = await response.blob();
          const storageRef = ref(storage, documentName);
          const result = await uploadBytes(storageRef, blobFile);
          const docDownloadURL = await getDownloadURL(ref(result.ref));
          setDocumentDownloadURL(docDownloadURL);
          resolve({ docDownloadURL, documentName });
        } catch (err) {
          console.error('Error uploading document', err);
          resolve(false);
        }
      }
    })
  }

  const removeDocument = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const documentRef = ref(storage, oldDoc);
        await deleteObject(documentRef);
        resolve(true);
      } catch (err) {
        console.error('Error deleteing old document', err);
        resolve(false);
      }
    })
  }

  const deletePIC = async () => {
    try {
      setIsUploading(true);
      const documentRef = doc(db, "PIC", dataUID);
      await updateDoc(documentRef, {
        deleted: true
      });
      setIsUploading(false);
      alertPopup('Success', 'PIC has been deleted successfully', true);
    } catch (err) {
      setIsUploading(false);
      console.error('Error deleting PIC', err);
      alertPopup('Error', 'Something went wrong when deleting PIC', false);
    }
  }

  const savePIC = async () => {
    if (picName == '') {
      alertPopup('Warning', 'Please fill in PIC Name', false);
    } else {
      setIsUploading(true);
      const userInfo = await getUser();
      try {
        const params = {
          uploader: userInfo,
          deleted: false,
          picName,
          description,
          imageNameRef: imageFileName || '',
          imageDownloadURL: imageDownloadURL || '',
          documentNameRef: documentFileName || '',
          documentDownloadURL: documentDownloadURL || ''
        }
        if (isNewData) {
          try {
            if (image && image.uri) {
              const { picDownloadURL, imageName } = await uploadImage();
              params.imageNameRef = imageName;
              params.imageDownloadURL = picDownloadURL;
            }

            if (document && document.uri) {
              const { docDownloadURL, documentName } = await uploadDocument();
              params.documentNameRef = documentName;
              params.documentDownloadURL = docDownloadURL;
            }
            await addDoc(collection(db, "PIC"), params)
            setIsUploading(false);
            alertPopup('Success', 'PIC added successfully', true);
          } catch (err) {
            console.error('Error uploading new pic', err);
            setIsUploading(false);
            alertPopup('Error', 'Something went wrong when adding new PIC', false);
          }
        } else {
          try {
            if (removeOldImage) {
              await removeImage();
              if (image && image.uri) {
                const { picDownloadURL, imageName } = await uploadImage();
                params.imageNameRef = imageName;
                params.imageDownloadURL = picDownloadURL;
              }
            } else if (isNewUploadedImage) {
              if (image && image.uri) {
                const { picDownloadURL, imageName } = await uploadImage();
                params.imageNameRef = imageName;
                params.imageDownloadURL = picDownloadURL;
              }
            }
            if (removeOldDoc) {
              await removeDocument();
              if (document && document.uri) {
                const { docDownloadURL, documentName } = await uploadDocument();
                params.documentNameRef = documentName;
                params.documentDownloadURL = docDownloadURL;
              }
            } else if (isNewUploadedDocument) {
              if (document && document.uri) {
                const { docDownloadURL, documentName } = await uploadDocument();
                params.documentNameRef = documentName;
                params.documentDownloadURL = docDownloadURL;
              }
            }
            const documentRef = doc(db, "PIC", dataUID);
            await updateDoc(documentRef, params);
            setIsUploading(false);
            alertPopup('Success', 'PIC updated successfully', true);
          } catch (err) {
            console.error('Error uploading updated PIC', err);
            setIsUploading(false);
            alertPopup('Error', 'Something went wrong when updating PIC', false);
          }
        }
      } catch (err) {
        console.error('Error adding PIC', err);
        alertPopup('Error', 'Error adding PIC', false);
        setIsUploading(false);
      }
    }
  }

  const goTo = (navi) => {
    props.navigation.navigate(navi);
  }

  const confirmationReplaceImage = () => Alert.alert('Replace Image', 'Are you sure you want to replace current image?', [{
    text: 'No',
    onPress: () => console.log('Cancel replace')
  }, {
    text: 'Yes',
    onPress: () => replaceImage()
  }])

  const confirmationReplaceDocument = () => Alert.alert('Replace Document', 'Are you sure you want to replace current document?', [{
    text: 'No',
    onPress: () => console.log('Cancel replace doc')
  }, {
    text: 'Yes',
    onPress: () => replaceDocument()
  }])

  const confirmDelete = () => Alert.alert('Confirm Delete', 'Are you sure you want to delete?', [{
    text: 'Cancel',
    onPress: () => console.log('Cancel delete'),
  }, {
    text: 'Delete',
    onPress: () => deletePIC()
  }])

  const alertPopup = (title, message, action) => Alert.alert(title, message, [{
    text: 'OK',
    onPress: action ? () => goTo('PICList') : () => console.log('OK Pressed')
  }]);
  if (isLoading) {
    return <CustomProjectListLoader />
  } else if (isUploading) {
    return (
      <View>
        <ProgressLoader
          visible={true}
          isModal={true}
          isHUD={true}
          hudColor="#525253"
          color="#FAF9F6"
        ></ProgressLoader>
      </View>
    )
  } else {
    return (
      <>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={image && image.uri ? MARGINWITHIMAGESELECTED : MARGINWITHOUTIMAGESELECTED}
              >

                {image && <Image source={{ uri: image.uri || image }} style={{ width: 300, height: 300 }}></Image>}
                {!image && <View style={{ widht: '100%', height: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No image selected</Text></View>}

                {!isNewUploadedImage &&
                  <CustomButton
                    onPress={() => confirmationReplaceImage()}
                    text="Replace Image"
                    loading={isLoading || isUploading}
                    btnColor="#000080"
                    txtColor="white"
                  />
                }

                {isNewUploadedImage &&
                  <CustomButton
                    onPress={() => pickImage()}
                    text="Select Image"
                    loading={isLoading || isUploading}
                    btnColor="#000080"
                    txtColor="white"
                  />
                }

                <CustomInput
                  setValue={setPicName}
                  value={picName}
                  placeholderTextColor="#a1adb9"
                  placeholder="PIC Name"
                />

                <CustomInput
                  setValue={setDescription}
                  value={description}
                  placeholderTextColor="#a1adb9"
                  placeholder="Description of PIC"
                />

                <>
                  {document &&
                    <View style={docContainer}>
                      <View style={docLogo}>
                        <Text style={{ textAlign: 'center', color: 'white' }}>{docFileType}</Text>
                      </View>
                      <View style={styles.documentContent}>
                        <Text>{document.name || documentFileName}</Text>
                      </View>
                    </View>}
                  {!document && <View style={{ width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No document selected</Text></View>}
                  {!isNewUploadedDocument &&
                    <CustomButton
                      onPress={() => confirmationReplaceDocument()}
                      text="Replace Document"
                      loading={isLoading || isUploading}
                      btnColor="#000080"
                      txtColor="white"
                    />
                  }

                  {isNewUploadedDocument &&
                    <CustomButton
                      onPress={() => pickDocument()}
                      text="Select Document"
                      loading={isLoading || isUploading}
                      btnColor="#000080"
                      txtColor="white"
                    />
                  }
                </>

                <CustomButton
                  onPress={() => savePIC()}
                  text={isNewData ? "Create PIC" : 'Update PIC'}
                  loading={isLoading || isUploading}
                  btnColor="#570861"
                  txtColor="white"
                />

                {!isNewData &&
                  <CustomButton
                    onPress={() => confirmDelete()}
                    text="Delete PIC"
                    loading={isLoading || isUploading}
                    btnColor="#FF3333"
                    txtColor="white"
                  />
                }
              </KeyboardAvoidingView>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
        <CustomProjectSpeedDial outsideProps={props} isPIC></CustomProjectSpeedDial>
      </>
    )
  }
}