import { useEffect, useState, useCallback } from 'react';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectList } from 'react-native-dropdown-select-list';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import SelectDropdown from 'react-native-select-dropdown';
import styles from './styles';
import CustomButton from '../../components/customButton';
import CustomInput from '../../components/customInput';
import CustomRadioButton from '../../components/customRadioButton';

export default function RegisterScreen(props) {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const typeChoice = [
    { label: 'Constructor', value: 'constructor' },
    { label: 'Employee', value: 'employee' }
  ]

  const goTo = (navi) => {
    props.navigation.navigate(navi);
  }

  const register = async () => {
    if (email == '' || name == '' || password == '' || confirmPassword == '' || type == '') {
      // ToastAndroid.show('Please fill in all the details!', ToastAndroid.SHORT);
      alertPopup('Warning', 'Please fill in all the details!');
    } else if (password !== confirmPassword) {
      alertPopup('Warning', 'Password does not match confirm password!');
      // ToastAndroid.show('Password does not match confirm password!', ToastAndroid.SHORT);
    } else if (email !== '' && name !== '' && password !== '' && password == confirmPassword) {
      setIsButtonDisabled(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
          await setDoc(doc(db, "Users", userCredentials.user?.uid), {
            name,
            email,
            type
          });
          alertPopup('Success', 'Registered successful. Please log in');
          // ToastAndroid.show('Registered successfully. Please log in', ToastAndroid.SHORT);
          setEmail('');
          setName('');
          setPassword('');
          setConfirmPassword('');
          setTimeout(() => goTo('Login'), 1000);
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
      <StatusBar translucent barStyle="dark-content" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#f7f7f7' }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.register]}>Register</Text>

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

            <CustomRadioButton
              value={typeChoice}
              select={(val) => setType(val)}
              selected={type}
            />

            {/* <SelectDropdown
              data={typeChoiceArray}
              onSelect={(selectedItem, index) => {
                setType(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              rowTextForSelection={(item, index) => item}
              buttonTextStyle={{ color: '#a1adb9' }}
              buttonStyle={{ width: '100%', backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#e8e8e8', marginVertical: 5 }}
              defaultButtonText="Select type"
            /> */}

            <CustomButton
              onPress={() => register()}
              text="Register Now!"
              loading={isButtonDisabled}
              btnColor="#000080"
              txtColor="white"
            />

            <CustomButton
              onPress={() => goTo('Login')}
              text="Already got an account? Login now!"
              disable={isButtonDisabled}
              btnColor="#570861"
              txtColor="white"
            />

          </KeyboardAwareScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  )
}