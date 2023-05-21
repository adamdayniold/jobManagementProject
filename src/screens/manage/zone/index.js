import { useState, useCallback } from 'react';
import { Alert, Image, View, Text, SafeAreaView, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import moment from 'moment';

export default function ManageZoneScreen(props) {
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
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [documentFileName, setDocumentFileName] = useState('');
  const [imageDownloadURL, setImageDownloadURL] = useState('');
  const [documentDownloadURL, setDocumentDownloadURL] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
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
  const [uploaderInfo, setUploaderInfo] = useState({});

  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    const { isNew, data } = props.route.params;
    const userDetails = auth.currentUser;
    setUserUID(userDetails.uid)
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
      setDateTime(new Date());
      setDescription('');
    } else {
      if (data.documentNameRef) {
        const typeOfFile = data.documentNameRef.split('.').pop();
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
      setDateTime(new Date(data.dateTime));
      setDescription(data.description);
      setUploaderInfo(data.uploader);
    }
    setIsLoading(false);
  }, []))

  const getUser = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = {};
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach((doc) => {
            if (doc.id === userUID) {
              list['id'] = doc.id;
              list['name'] = doc.data().name;
              list['email'] = doc.data().email;
              list['company'] = doc.data().company;
              list['designation'] = doc.data().designation;
            }
          });
          resolve(list);
        }
      } catch (err) {
        resolve(false);
        console.error('Error fetching uploader information', err);
        alertPopup('Error', 'Error fetching uploader information', false);
      }
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
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
    setOldDoc(documentFileName)
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
          const picDownloadURL = await getDownloadURL(result.ref);
          setImageDownloadURL(picDownloadURL);
          resolve({ picDownloadURL, imageName });
        } catch (err) {
          console.error('Error uploading image', err);
          resolve(false);
        }
      }
    })
  }

  const removeImage = async () => {
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
          const docDownloadURL = await getDownloadURL(result.ref);
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
        console.error('Error deleting old document', err);
        resolve(false);
      }
    })
  }

  const deleteEvent = async () => {
    try {
      setIsUploading(true);
      const documentRef = doc(db, "Events", dataUID);
      await updateDoc(documentRef, {
        deleted: true
      });
      setIsUploading(false);
      alertPopup('Success', 'Event has been deleted successfully', true);
    } catch (err) {
      setIsUploading(false);
      console.error('Error deleting event', err);
      alertPopup('Error', 'Something went wrong when deleting event', false);
    }
  }

  const archiveEvent = async () => {
    try {
      setIsUploading(true);
      const documentRef = doc(db, "Events", dataUID);
      await updateDoc(documentRef, {
        archived: true
      });
      setIsUploading(false);
      alertPopup('Success', 'Event has been archived successfully', true);
    } catch (err) {
      setIsUploading(false);
      console.error('Error archiving event', err);
      alertPopup('Error', 'Something went wrong when archiving event', false);
    }
  }

  const saveZone = async () => {
    if (dateTime == '') {
      alertPopup('Warning', 'Please select date and time details!', false);
    } else {
      setIsUploading(true);
      const userInfo = await getUser();
      try {
        const params = {
          uploader: userInfo,
          deleted: false,
          archived: false,
          description,
          dateTime: dateTime.getTime(),
          imageNameRef: imageFileName || '',
          imageDownloadURL: imageDownloadURL || '',
          documentNameRef: documentFileName || '',
          documentDownloadURL: documentDownloadURL || '',
        }
        if (isNewData) {
          try {
            params.comments = [];
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
            await addDoc(collection(db, "Events"), params);
            setIsUploading(false);
            alertPopup('Success', 'Event added successfully', true);
          } catch (err) {
            console.error('Error uploading new events', err);
            setIsUploading(false);
            alertPopup('Error', 'Someting went wrong when adding new event', false)
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

            const documentRef = doc(db, "Events", dataUID);
            await updateDoc(documentRef, params);
            setIsUploading(false);
            alertPopup('Success', 'Event updated successfully', true);
          } catch (err) {
            console.error('Error uploading updated events', err);
            setIsUploading(false);
            alertPopup('Error', 'Something went wrong when updating event', false);
          }
        }
      } catch (err) {
        console.log('Error adding event', err);
        alertPopup('Error', 'Error adding event', false);
        setIsUploading(false);
      }
    }
  }

  const SelectingDate = () => {
    setShowDateTimePicker(true);
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
    onPress: () => deleteEvent()
  }])

  const confirmArchived = () => Alert.alert('Confirm Archived', 'Are you sure you want to archived?', [{
    text: 'Cancel',
    onPress: () => console.log('Cancel archive'),
  }, {
    text: 'Archive',
    onPress: () => archiveEvent()
  }])

  const alertPopup = (title, message, action) => Alert.alert(title, message, [{
    text: 'OK',
    onPress: action ? () => goTo('ZonesList') : () => console.log('OK Pressed')
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
        >
        </ProgressLoader>
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
                style={image ? MARGINWITHIMAGESELECTED : MARGINWITHOUTIMAGESELECTED}
              >
                <>
                  {image && <Image source={{ uri: image.uri || image }} style={{ width: 300, height: 300, marginBottom: 10 }}></Image>}
                  {!image && <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No image selected</Text></View>}

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
                </>

                <>
                  <View style={styles.datePicker}>
                    <TouchableWithoutFeedback onPress={SelectingDate}>
                      <View>
                        <Text>{moment(dateTime).format('DD MMM YYYY') || 'Select date'}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  {showDateTimePicker &&
                    <DateTimePicker
                      onChange={(event, date) => {
                        setShowDateTimePicker(false);
                        if (event.type == 'set') setDateTime(date);
                      }}
                      value={dateTime}
                      minimumDate={new Date()}
                      mode='date'
                    />
                  }
                </>

                <CustomInput
                  setValue={setDescription}
                  value={description}
                  placeholderTextColor='#a1adb9'
                  placeholder="Description"
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
                      loading={isLoading}
                      btnColor="#000080"
                      txtColor="white"
                    />
                  }
                </>

                <CustomButton
                  onPress={() => saveZone()}
                  text={isNewData ? "Create Event" : 'Update Event'}
                  loading={isLoading}
                  btnColor="#570861"
                  txtColor="white"
                />
                {!isNewData && (uploaderInfo?.id === userUID) &&
                  <CustomButton
                    onPress={() => confirmArchived()}
                    text="Archive Event"
                    loading={isLoading}
                    btnColor="#FF3333"
                    txtColor="white"
                  />
                }

                {/* {!isNewData &&
                  <CustomButton
                    onPress={() => confirmDelete()}
                    text="Delete Event"
                    loading={isLoading}
                    btnColor="#FF3333"
                    txtColor="white"
                  />
                } */}
              </KeyboardAvoidingView>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
        <CustomProjectSpeedDial outsideProps={props} isEvent></CustomProjectSpeedDial>
      </>
    )
  }
}