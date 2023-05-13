import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase';

import CustomProjectSpeedDial from '../../../../components/customProjectSpeedDial';
import CustomSwipableListView from '../../../../components/view/customSwipableListView';
import CustomProjectListLoader from '../../../../components/customProjectListLoader';
import CustomRoundedButton from '../../../../components/customRoundedButton';
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

  const getUsers = async (user) => {
    try {
      setIsLoading(true);
      const list = [];
      const usersRef = collection(db, "Users");
      const usersList = await getDocs(usersRef);
      if (usersList) {
        usersList.forEach((doc) => {
          if (doc.data().includes(user.uid)) {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          }
        });
        setUserItem(list.sort((a, b) => a.name.localeCompare(b.type)));
        console.log(list)
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

  const handleEvents = () => {
    console.log('handleevents')
  }

  const handlePIC = () => {
    console.log('handle PIC')
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
          {/* {userItem && userItem.length > 0 ? <UserListComponent /> : <EmptyList type="user" />} */}
          <View style={styles.buttonPIC}>
            <View>
              <CustomRoundedButton
                onPress={() => handleEvents()}
                disable={isLoading}
                icon="event"
                type="material"
                color="#570861"
              />
              <Text style={styles.insideButtonPIC}>Events</Text>
            </View>
            <View>
              <CustomRoundedButton
                onPress={() => handlePIC()}
                disable={isLoading}
                icon="toc"
                type="material"
                color="#570861"
              />
              <Text style={styles.insideButtonPIC}>PIC</Text>
            </View>
          </View>
        </ScrollView>
        {/* <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isAdmin isDashboard /> */}
      </>
    )
  }
}