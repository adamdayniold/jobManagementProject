import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Alert, Text, StatusBar, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
        await checkUserType(data.user.uid);
      })
      .catch(() => alertPopup('Error', 'Invalid credentials'))
      // .catch(() => ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT))
      .finally(() => setIsButtonDisabled(false))
  }

  const checkUserType = async (userUID) => {
    try {
      setEmail('');
      setPassword('');
      const docRef = doc(db, 'Users', userUID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { type } = docSnap.data();
        if (type === 'admin') goTo('AdminDashboard');
        else if (type === 'constructor') goTo('ConstructorDashboard');
        else if (type === 'employee') goTo('EmployeeDashboard');
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
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#f7f7f7' }}
            contentContainerStyle={styles.container}
            scrollEnabled={false}
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="handled"
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
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  )
}