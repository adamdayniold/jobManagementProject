import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, ScrollView } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

import CustomRoundedButton from '../../../components/customRoundedButton';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import styles from './styles';

export default function EmployeeDashboardScreen(props) {

  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    const fetchInformation = async () => {
      const user = auth.currentUser;
      if (user) {
        await getUsers(user)
      }
    }
    fetchInformation();
  }, []))

  const getUsers = async (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        const list = [];
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach(doc => {
            list.push({
              id: doc.id,
              ...doc.data()
            })
          })
          const userData = list.find(details => details.id === user.uid);
          setUserItem(userData);
          resolve(userData);
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        resolve(true);
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
          {/* {userItem && userItem.length > 0 ? <UserListComponent /> : <EmptyList type="user" />} */}
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.detailsText}>Name: {userItem.name}</Text>
          <Text style={styles.detailsText}>Email: {userItem.email}</Text>
          <View style={styles.buttonPIC}>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('ZonesList', { user: 'employee' })}
                disable={isLoading}
                icon="event"
                type="material"
                color="#570861"
              />
              <Text style={styles.insideButtonPIC}>Events</Text>
            </View>
            <View>
              <CustomRoundedButton
                onPress={() => goTo('UsersList', { user: 'employee' })}
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