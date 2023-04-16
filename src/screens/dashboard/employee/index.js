import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, StyleSheet } from 'react-native';

import { auth, db } from '../../../../firebase';
import { collection, getDocs, getDoc, doc, addDoc, writeBatch, where, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import { ScrollView } from 'react-native-gesture-handler';
import CustomZoneView from '../../../components/view/customZoneView';
import styles from './styles';

export default function EmployeeDashboardScreen(props) {

  const [zoneItem, setZoneItem] = useState([]);
  const [userInformation, setUserInformation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userItem, setUserItem] = useState([]);
  const [allItemData, setAllItemData] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchInformation = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        const sortedZone = await getZone(user);
        const sortedUser = await getUser();
        const userSet = await setUser(sortedZone, sortedUser);
        const zoneItemDetails = JSON.stringify(userSet);
        setUserInformation(user);
        setAllItemData(JSON.parse(zoneItemDetails));
      }
      setIsLoading(false);
    }
    fetchInformation();
  }, []))

  const getZone = async (user) => {
    return new Promise((async (resolve, reject) => {
      try {
        const list = [];
        const listZones = await getDocs(collection(db, 'Zones'));
        if (listZones) {
          listZones.forEach((doc) => {
            if (doc.data().employeeList.length > 0 && doc.data().employeeList.includes(user.uid)) {
              list.push({
                id: doc.id,
                ...doc.data()
              });
            }
          });
          const sortedZone = list.sort((a, b) => a.name.localeCompare(b.name));
          setZoneItem(sortedZone);
          resolve(sortedZone);
        }
      } catch (err) {
        setIsLoading(false);
        resolve(true);
        alertPopup('Error', 'Error fetching project list');
      }
    }))
  }

  const setUser = (zoneDetails, userDetails) => {
    return new Promise((resolve, reject) => {
      if (zoneDetails && zoneDetails.length > 0) {
        let employeeListing = [];
        let constructorListing = [];
        zoneDetails.forEach((zone) => {
          employeeListing = [];
          constructorListing = [];
          if (zone.employeeList.length > 0) {
            zone.employeeList.forEach(empUserData => {
              userDetails.find(userData => {
                if (empUserData === userData.id) employeeListing.push(empUserData);
              })
            })
          }
          if (zone.constructorList.length > 0) {
            zone.constructorList.forEach(consData => {
              userDetails.find(consUserData => {
                if (consData === consUserData.id) constructorListing.push(consUserData);
              })
            })
          }
          zone['employeeDetails'] = [...employeeListing];
          zone['constructorDetails'] = [...constructorListing];
        })
      }
      resolve(zoneDetails);
    })
  }

  const getUser = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        const list = [];
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach(doc => {
            if (doc.data().type != 'admin') {
              list.push({
                id: doc.id,
                ...doc.data()
              })
            }
          })
          const sortedUser = list.sort((a, b) => a.name.localeCompare(b.name));
          setUserItem(sortedUser);
          resolve(sortedUser);
        }
      } catch (err) {
        setIsLoading(false);
        resolve(true);
        alertPopup('Error', 'Error fetching users list');
      }
    })
  }

  const ZoneListComponent = () => {
    return (
      <CustomZoneView
        data={allItemData}
        currentUserInformation={userInformation}
      />
    )
  }

  const EmptyList = ({ type }) => {
    return (
      <View style={styles.emptyListView}>
        <Text style={styles.emptyList}>No zone is assigned to you</Text>
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
          {userItem && zoneItem && zoneItem.length > 0 && userItem.length > 0 ? <ZoneListComponent /> : <EmptyList />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isDashboard />
      </>
    )
  }
}