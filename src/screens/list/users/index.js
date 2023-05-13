import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomSwipableListView from '../../../components/view/customSwipableListView';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import styles from './styles';

export default function UsersListScreen(props) {

  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchUserInformation = async () => {
      const userDetails = auth.currentUser;
      if (userDetails) await getUsers();
    }
    fetchUserInformation();
  }, []))

  const getUsers = async () => {
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
        setUserItem(list.sort((a, b) => a.name.localeCompare(b.type)));
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      alertPopup('Error', 'Error fetching users list');
    }
  }

  const handleEdit = () => {
    return;
  }

  const UserListComponent = () => userItem.map((userList) => {
    return (
      <CustomSwipableListView
        goTo={(name) => goTo(name)}
        onEdit={() => handleEdit()}
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
        <CustomProjectSpeedDial outsideProps={props} isZoneEditable={false} isUserAddible={true} isNew />
      </>
    )
  }
}