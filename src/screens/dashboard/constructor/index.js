import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, StyleSheet } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs, doc, addDoc, writeBatch, where, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import { ScrollView } from 'react-native-gesture-handler';

export default function ConstructorDashboardScreen(props) {

  const [userEmail, setUserEmail] = useState('');
  const [zoneItem, setZoneItem] = useState([]);
  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      await getUsers();
      await getZone();
    }
  }, []))

  const getZone = async () => {
    try {
      const list = [];
      const listZones = await getDocs(collection(db, 'Zone'));
      if (listZones) {
        listZones.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data()
          });
        });
        const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
        sortedList.forEach((zoneDetails) => {
          const listWithEmployee = [];
          userItem.forEach((userDetails) => {
            if (zoneDetails.employeeList.length > 0 && userDetails.employeeList.includes(userDetails.id)) {
              listWithEmployee.push(userDetails);
            }
          })
          sortedList.employee = listWithEmployee;
        })
        setZoneItem(sortedList);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      alertPopup('Error', 'Error fetching project list');
    }
  }

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const list = [];
      const usersRef = collection(db, "Users");
      const usersList = await getDocs(usersRef);
      if (usersList) {
        usersList.forEach((doc) => {
          if (doc.data().type === 'Employee') {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          }
        });
        setUserItem(list.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err) {
      setIsLoading(false);
      alertPopup('Error', 'Error fetching users list');
    }
  }

  const UserListComponent = () => userItem.map((userList) => {
    return (
      <CustomSwipableListView
        goTo={(name) => goTo(name)}
        onEdit={(data) => handleOpenFormSheet(data)}
        isRegistered={true}
        list={userList}
        key={userList.id}
      />
    )
  })

  const ZoneListComponent = () => zoneItem.map((zoneList) => {
    return (
      <CustomSwipableListView
        goTo={(name) => goTo(name)}
        onEdit={(data) => handleOpenFormSheet(data)}
        isRegistered={true}
        list={zoneList}
        key={zoneList.id}
      />
    )
  })

  const EmptyList = ({ type }) => {
    return (
      <View style={styles.emptyListView}>
        <Text style={styles.emptyList}>No {type} data...</Text>
      </View>
    )
  }

  const goTo = () => {
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);
  if (isLoading) {
    return <CustomProjectListLoader />
  } else {
    return (
      <>
        <ScrollView>
          {userItem && userItem.length > 0 ? <UserListComponent /> : <EmptyList type="user" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isDashboard />
      </>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    color: 'black'
  },
});