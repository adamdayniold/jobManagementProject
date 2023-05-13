import React from 'react';
import { useState } from 'react';
import { Alert, Text, StatusBar, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

import styles from './styles';
import CustomButton from '../../components/customButton';
import CustomInput from '../../components/customInput';


export default function LoginScreen(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // login using saved credentials or new
  const loginWithEmailPassword = () => {
    setIsButtonDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (data) => {
        await loginUser(data.user.uid);
      })
      .catch(() => alertPopup('Error', 'Invalid credentials'))
      .finally(() => setIsButtonDisabled(false))
  }

  const loginUser = async (userUID) => {
    try {
      const docRef = doc(db, 'Users', userUID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmail('');
        setPassword('');
        goTo('UserDashboard');
      } else {
        alertPopup('Error', 'Account does not exists');
      }
    } catch (err) {
      console.error(err);
      alertPopup('Error', 'Error fetching account details');
    }
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);

  const goTo = (navi) => {
    props.navigation.navigate(navi);
  }

  return (
    <>
      <StatusBar translucent barStyle="light-content" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Text style={styles.login}>Login</Text>

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

            <CustomButton
              onPress={() => loginWithEmailPassword()}
              text="Login"
              loading={isButtonDisabled}
              btnColor="#000080"
              txtColor="white"
            />

            <CustomButton
              onPress={() => goTo('Register')}
              text="Register Now!"
              disable={isButtonDisabled}
              btnColor="#570861"
              txtColor="white"
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  )
}