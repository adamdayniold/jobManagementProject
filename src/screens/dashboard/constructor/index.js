import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, ScrollView } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

import CustomRoundedButton from '../../../components/customRoundedButton';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import styles from './styles';

export default function ConstructorDashboardScreen(props) {

  const [userItem, setUserItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
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
          setUserItem(userData);
          resolve(userData);
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        alertPopup('Error', 'Error fetching users list');
      }
    })
  }

  const goTo = (route, param) => {
    props.navigation.navigate(route, param);
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
          <Text style={styles.detailsText}>Name: {userItem.name}</Text>
          <Text style={styles.detailsText}>Email: {userItem.email}</Text>
          <View style={styles.buttonPIC}>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('ZonesList', { user: 'constructor' })}
                disable={isLoading}
                icon="event"
                type="material"
                color="#570861"
              />
              <Text style={styles.insideButtonPIC}>Events</Text>
            </View>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('UsersList', { user: 'constructor' })}
                disable={isLoading}
                icon="toc"
                type="material"
                color="#570861"
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