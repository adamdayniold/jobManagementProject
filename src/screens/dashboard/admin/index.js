import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, StyleSheet } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs, doc, addDoc, writeBatch, where, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomSwipableListView from '../../../components/view/customSwipableListView';
import { ScrollView } from 'react-native-gesture-handler';

export default function AdminDashboardScreen(props) {

  const [userEmail, setUserEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoneItem, setZoneItem] = useState([]);
  const [userItem, setUserItem] = useState([]);
  const [userType, setUserType] = useState('Constructor');

  useFocusEffect(useCallback(() => {
    const user = auth.currentUser;
    if (user) {
      getUsers();
      getZone();
    }
  }, []))

  const handleOpenFormSheet = (data) => {
    if (!data) {
      setSelectedItem(null);
      setProjectName('');
      setStartDate(new Date());
      openBtmFormRef(0);
    } else {
      setSelectedItem(data);
      btmSelectionRef.current.open(0);
    }
  }

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
        setZoneItem(list.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err) {
      alertPopup('Error', 'Error fetching project list');
    }
  }

  const getUsers = async () => {
    try {
      const list = [];
      const usersRef = collection(db, "Users");
      const usersList = await getDocs(usersRef);
      if (usersList) {
        usersList.forEach((doc) => {
          if (doc.data().type !== 'Admin') {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          }
        });
        setUserItem(list.sort((a, b) => a.name.localeCompare(b.type)));
      }
    } catch (err) {
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

  const ZoneListComponent = () => userItem.map((userList) => {
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

  return (
    <>
      <ScrollView>
        {userItem && userItem.length > 0 ? <UserListComponent /> : <EmptyList type="user" />}
      </ScrollView>
      <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered={true} isAdmin={true} />
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    color: 'black'
  },
});