import { useState } from 'react';
import { Alert, Text, StatusBar, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import styles from './styles';
import CustomButton from '../../components/customButton';
import CustomInput from '../../components/customInput';

export default function RegisterScreen(props) {

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const goTo = (navi) => {
    props.navigation.navigate(navi);
  }

  const register = async () => {
    if (email == '' || name == '' || password == '' || confirmPassword == '' || company == '' || designation == '') {
      // ToastAndroid.show('Please fill in all the details!', ToastAndroid.SHORT);
      alertPopup('Warning', 'Please fill in all the details!');
    } else if (password !== confirmPassword) {
      alertPopup('Warning', 'Password does not match confirm password!');
      // ToastAndroid.show('Password does not match confirm password!', ToastAndroid.SHORT);
    } else if (email !== '' && name !== '' && password !== '' && company !== '' && designation !== '' && password == confirmPassword) {
      setIsButtonDisabled(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
          await setDoc(doc(db, "Users", userCredentials.user?.uid), {
            name,
            company,
            designation,
            email
          });
          alertPopup('Success', 'Registered successful. Please log in');
          // ToastAndroid.show('Registered successfully. Please log in', ToastAndroid.SHORT);
          setEmail('');
          setName('');
          setCompany('');
          setDesignation('');
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
      <StatusBar translucent barStyle="light-content" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
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
                setValue={setCompany}
                value={company}
                placeholderTextColor='#a1adb9'
                placeholder="Company"
              />

              <CustomInput
                setValue={setDesignation}
                value={designation}
                placeholderTextColor='#a1adb9'
                placeholder="Designation"
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
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  )
}