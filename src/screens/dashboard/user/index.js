import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, ScrollView } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

import CustomRoundedButton from '../../../components/customRoundedButton';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import styles from './styles';

export default function UserDashboardScreen(props) {

  const [userItem, setUserItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initial, setInitial] = useState('');

  useFocusEffect(useCallback(() => {
    const fetchUserInformation = async () => {
      const user = auth.currentUser;
      if (user) {
        await getUsers(user);
      }
    }
    fetchUserInformation();
  }, []))

  const getUsers = async (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true)
        const list = [];
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach((doc) => {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          });
          const userData = list.find(details => details.id === user.uid);
          const userInitial = userData.name.slice(0, 1);
          setInitial(userInitial.toUpperCase());
          setUserItem(userData);
          resolve(userData)
          setIsLoading(false);
        }
      } catch (err) {
        alertPopup('Error', 'Error fetching users list');
      }
    })
  }

  const goTo = (route) => {
    props.navigation.navigate(route);
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);
  if (isLoading) {
    return <CustomProjectListLoader />
  } else {
    return (
      <>
        <ScrollView style={styles.container}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 55, height: 55 }}>
              <View style={{ justifyContent: 'center', backgroundColor: 'grey', height: '100%', borderRadius: 50 }}>
                <Text style={{ textAlign: 'center', fontSize: 20 }}>{initial}</Text>
              </View>
            </View>
          </View>
          <Text style={{ marginVertical: 0, marginHorizontal: 10, fontSize: 22, fontWeight: 600, textAlign: 'center' }}>{userItem.name}</Text>
          <Text style={{ marginVertical: 0, marginHorizontal: 10, fontSize: 19, textAlign: 'center' }}>{userItem.email}</Text>
          <View style={{ marginTop: 20, marginHorizontal: 15, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#D3D3D3', borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }}>
            <Text style={styles.detailsText}>Company: {userItem.company}</Text>
          </View>
          <View style={{ marginBottom: 20, marginHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }}>
            <Text style={styles.detailsText}>Designation: {userItem.designation}</Text>
          </View>
          <View style={styles.buttonPIC}>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('ZonesList')}
                disable={isLoading}
                icon="event"
                type="material"
                color="#570861"
                large
              />
              <Text style={styles.insideButtonPIC}>Events</Text>
            </View>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('PICList')}
                disable={isLoading}
                icon="toc"
                type="material"
                color="#570861"
                large
              />
              <Text style={styles.insideButtonPIC}>PIC</Text>
            </View>
          </View>
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} isDashboard />
      </>
    )
  }
}