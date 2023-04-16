import { useEffect, useState, useCallback } from 'react';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectList } from 'react-native-dropdown-select-list';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

import SelectDropdown from 'react-native-select-dropdown';
import styles from './styles';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomRadioButton from '../../../components/customRadioButton';

export default function ManageUserScreen(props) {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const typeChoice = [
    { label: 'Admin', value: 'admin' },
    { label: 'Constructor', value: 'constructor' },
    { label: 'Employee', value: 'employee' }
  ]

  const register = async () => {
    if (email == '' || name == '' || password == '' || confirmPassword == '' || type == '') {
      // ToastAndroid.show('Please fill in all the details!', ToastAndroid.SHORT);
      alertPopup('Warning', 'Please fill in all the details!');
    } else if (password !== confirmPassword) {
      alertPopup('Warning', 'Password does not match confirm password!');
      // ToastAndroid.show('Password does not match confirm password!', ToastAndroid.SHORT);
    } else if (email !== '' && name !== '' && password !== '' && password == confirmPassword && type !== '') {
      setIsButtonDisabled(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
          await setDoc(doc(db, "Users", userCredentials.user?.uid), {
            name,
            email,
            type
          });
          alertPopup('Success', 'Registered successful');
          // ToastAndroid.show('Registered successfully. Please log in', ToastAndroid.SHORT);
          setEmail('');
          setName('');
          setPassword('');
          setConfirmPassword('');
          setType('');
        })
        .catch(() => alertPopup('Error', 'Unable to create user. Please try again later.'))
        // .catch(() => ToastAndroid.show('Error when creating user', ToastAndroid.SHORT))
        .finally(() => setIsButtonDisabled(false))
    }
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#f7f7f7' }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            resetScrollToCoords={{ x: 0, y: 0 }}
          >

            <CustomRadioButton
              value={typeChoice}
              select={(val) => setType(val)}
              selected={type}
            />

            <CustomInput
              setValue={setName}
              value={name}
              placeholderTextColor='#a1adb9'
              placeholder="Name"
            />

            <CustomInput
              setValue={setEmail}
              value={email}
              placeholderTextColor='#a1adb9'
              placeholder="Email Address"
            />

            <CustomInput
              setValue={setPassword}
              value={password}
              placeholderTextColor='#a1adb9'
              placeholder="Password"
              secureTextEntry
            />

            <CustomInput
              setValue={setConfirmPassword}
              value={confirmPassword}
              placeholderTextColor='#a1adb9'
              placeholder="Confirm Password"
              secureTextEntry
            />


            <CustomButton
              onPress={() => register()}
              text="Submit"
              loading={isButtonDisabled}
              btnColor="#000080"
              txtColor="white"
            />

          </KeyboardAwareScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
      <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isAdmin isDashboard={false}></CustomProjectSpeedDial>
    </>
  )
}