import { useEffect, useState, useCallback } from 'react';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { auth, db, storage } from '../../../../firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';

import styles from './styles';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MultiSelect } from 'react-native-element-dropdown';
import { ref, uploadString, putString, uploadBytes } from 'firebase/storage';
import moment from 'moment';

export default function ManageZoneScreen(props) {

  const [isLoading, setIsLoading] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [constructorList, setConstructorList] = useState([]);
  const [employeeSelected, setEmployeeSelected] = useState([]);
  const [constructorSelected, setConstructorSelected] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useFocusEffect(useCallback(() => {
    async function fetchData() {
      await fetchUser()
    }
    const { type } = props.route.params;
    setConstructorSelected([]);
    setEmployeeSelected([]);
    setImage(null);
    setName('');
    setDateTime(new Date());
    if (type === 'Admin') {
      setIsUserAdmin(true);
      fetchData();
    } else { setIsUserAdmin(false); }
  }, []))

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const empList = [];
      const constList = [];
      const usersRef = collection(db, "Users");
      const usersList = await getDocs(usersRef);
      if (usersList) {
        usersList.forEach((doc) => {
          if (doc.data().type !== 'admin') {
            if (doc.data().type === 'constructor') constList.push({ key: doc.id, id: doc.id, value: doc.id, label: doc.data().name, ...doc.data() });
            if (doc.data().type === 'employee') empList.push({ key: doc.id, id: doc.id, value: doc.id, label: doc.data().name, ...doc.data() });
          }
        });
        setEmployeeList(empList.sort((a, b) => a.name.localeCompare(b.name)));
        setConstructorList(constList.sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      alertPopup('Error', 'Error fetching users list');
    }
  }

  const goTo = (navi) => {
    props.navigation.navigate(navi);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })

    if (!result.canceled) {
      const fileName = result.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      const source = { uri: result.uri, name: fileName, type: fileType };
      setImage(source)
    } else {
      alertPopup('Error', 'Error selecting image');
    }
  }

  const uploadImage = async () => {
    return new Promise(async (resolve, reject) => {
      const currentDate = new Date();
      const epoch = Date.parse(currentDate);
      const imageURI = image.uri;
      const imageName = image.name + '-' + epoch;
      setImageFileName(imageName);
      if (image.uri) {
        try {
          const storageRef = ref(storage, imageName);
          const response = await fetch(imageURI);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
          resolve(true);
        } catch (err) {
          alertPopup('Error', 'Error uploading image');
          console.error(err);
          resolve(false);
        }
      }
    })
  }

  const saveZone = async () => {
    if (dateTime == '') {
      alertPopup('Warning', 'Please select date and time details!');
    } else {
      setIsButtonDisabled(true);
      try {
        let imageUploaded;
        if (imageFileName) imageUploaded = await uploadImage();

        await addDoc(collection(db, "Zones"), {
          name,
          zoneName,
          imageNameRef: imageFileName || '',
          dateTime: dateTime.getTime(),
          description,
          constructorList: constructorSelected,
          employeeList: employeeSelected
        })
        setIsButtonDisabled(false);
      } catch (err) {
        console.log('Error adding zones', err);
        alertPopup('Error', 'Error adding zones');
        setIsButtonDisabled(false);
      }
    }
  }

  // handle open selection sheet (edit or delete)
  const handleOpenSelectionSheet = (type) => {
    if (type === 'edit') {
      setProjectName(selectedItem?.name);
      setStartDate(selectedItem?.startDate);
      openBtmFormRef(0);
    } else if (type === 'delete') {
      setIsDialogVisible(true);
    }
    setCurrentProjectName(selectedItem?.name)
  }

  const SelectingDate = () => {
    setShowDateTimePicker(true);
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);
  if (isLoading) {
    return <CustomProjectListLoader />
  } else {
    return (
      <>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView>
              <KeyboardAwareScrollView
                style={{ backgroundColor: '#f7f7f7' }}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
              >

                {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }}></Image>}
                {!image && <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No image selected</Text></View>}
                <CustomButton
                  onPress={() => pickImage()}
                  text="Select Image"
                  loading={isButtonDisabled}
                  btnColor="#000080"
                  txtColor="white"
                  disable={!isUserAdmin}
                />

                <CustomInput
                  setValue={setName}
                  value={name}
                  placeholderTextColor='#a1adb9'
                  placeholder="Site name"
                  disable={!isUserAdmin}
                />

                <CustomInput
                  setValue={setZoneName}
                  value={zoneName}
                  placeholderTextColor='#a1adb9'
                  placeholder="Zone name"
                  disable={!isUserAdmin}
                />

                <CustomInput
                  setValue={setDescription}
                  value={description}
                  placeholderTextColor='#a1adb9'
                  placeholder="Description"
                />
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

                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={employeeList}
                  labelField="label"
                  valueField="value"
                  placeholder='Select Employee'
                  value={employeeSelected}
                  search
                  searchPlaceholder='Search Employee'
                  onChange={(item) => {
                    setEmployeeSelected(item)
                  }}
                />

                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={constructorList}
                  labelField="label"
                  valueField="value"
                  placeholder='Select Constructor'
                  value={constructorSelected}
                  search
                  searchPlaceholder='Search Constructor'
                  onChange={(item) => {
                    setConstructorSelected(item)
                  }}
                />

                <CustomButton
                  onPress={() => saveZone()}
                  text="Create Zone"
                  loading={isLoading || isButtonDisabled}
                  btnColor="#000080"
                  txtColor="white"
                // disable={!isUserAdmin}
                />

              </KeyboardAwareScrollView>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
        <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isAdmin={isUserAdmin} isDashboard={false}></CustomProjectSpeedDial>
      </>
    )
  }
}