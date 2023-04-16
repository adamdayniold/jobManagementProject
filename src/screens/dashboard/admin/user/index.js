import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase';

import CustomProjectSpeedDial from '../../../../components/customProjectSpeedDial';
import CustomSwipableListView from '../../../../components/view/customSwipableListView';
import CustomProjectListLoader from '../../../../components/customProjectListLoader';
import styles from './styles';

export default function AdminUserDashboardScreen(props) {

  const [selectedItem, setSelectedItem] = useState(null);
  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchUserInformation = async () => {
      const user = auth.currentUser;
      if (user) await getUsers();
    }
    fetchUserInformation();
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

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const list = [];
      const usersRef = collection(db, "Users");
      const usersList = await getDocs(usersRef);
      if (usersList) {
        usersList.forEach((doc) => {
          if (doc.data().type !== 'admin') {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          }
        });
        setUserItem(list.sort((a, b) => a.name.localeCompare(b.type)));
      }
      setIsLoading(false);
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
        <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isAdmin isDashboard />
      </>
    )
  }
}