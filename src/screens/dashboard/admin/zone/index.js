import { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Image, useWindowDimensions, View, Text, StatusBar, ToastAndroid, Keyboard, StyleSheet, ScrollView } from 'react-native';

import { collection, getDocs, doc, addDoc, writeBatch, where, query } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase';

import styles from './styles';
import CustomProjectSpeedDial from '../../../../components/customProjectSpeedDial';
import CustomProjectListLoader from '../../../../components/customProjectListLoader';
import CustomZoneView from '../../../../components/view/customZoneView'

export default function AdminZoneDashboardScreen(props) {

  const [userEmail, setUserEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [userItem, setUserItem] = useState([]);
  const [zoneItem, setZoneItem] = useState([]);
  const [allItemData, setAllItemData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const btmSelectionRef = useRef(null);

  useFocusEffect(useCallback(() => {
    async function fetchZoneData() {
      setIsLoading(true)
      const sortedZone = await getZone();
      const sortedUser = await getUsers();
      const userSet = await setUser(sortedZone, sortedUser);
      const zoneItemDetails = JSON.stringify(userSet);
      setAllItemData(JSON.parse(zoneItemDetails));
      setIsLoading(false);
    }
    const user = auth.currentUser;
    if (user) {
      fetchZoneData();
    }
  }, []))

  const handleOpenFormSheet = (data) => {
    btmSelectionRef.current.open(0);
  }

  const setUser = (zoneDetails, userDetails) => {
    return new Promise((resolve, reject) => {
      if (zoneDetails && zoneDetails.length > 0) {
        let employeeListing = []
        let constructorListing = [];
        zoneDetails.forEach((zone) => {
          employeeListing = [];
          constructorListing = [];
          if (zone.employeeList.length > 0) {
            zone.employeeList.forEach(empUserData => {
              userDetails.find((userData) => {
                if (empUserData === userData.id) {
                  employeeListing.push(empUserData);
                }
              })
            })
          }
          if (zone.constructorList.length > 0) {
            zone.constructorList.forEach(consData => {
              userDetails.find(consUserData => {
                if (consData === consUserData.id) {
                  constructorListing.push(consUserData);
                }
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

  const getUsers = async () => {
    return new Promise(async (resolve, reject) => {
      try {
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
          const sortedUser = list.sort((a, b) => a.name.localeCompare(b.type));
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

  const getZone = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = [];
        const listZones = await getDocs(collection(db, 'Zones'));
        if (listZones) {
          listZones.forEach((doc) => {
            list.push({
              id: doc.id,
              ...doc.data()
            });
          });
          const sortedZone = list.sort((a, b) => a.name.localeCompare(b.name))
          setZoneItem(sortedZone);
          resolve(sortedZone);
        }
      } catch (err) {
        setIsLoading(false);
        resolve(true);
        alertPopup('Error', 'Error fetching project list');
      }
    })
  }

  const ZoneListComponent = () => {
    return (
      <CustomZoneView
        data={allItemData}
        onLongPress={(index) => goTo('ZoneCreation', index)}
      />
    )
  }

  const EmptyList = ({ type }) => {
    return (
      <View style={styles.emptyListView}>
        <Text style={styles.emptyList}>No {type} data...</Text>
      </View>
    )
  }

  const goTo = (navi, index) => {
    if (navi === 'ZoneCreation') {
      props.navigation.navigate(navi, {
        isAdmin: true,
        isNew: false,
        data: allItemData[index]
      })
    } else { props.navigation.navigate(navi) }
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
          {zoneItem && zoneItem.length > 0 ? <ZoneListComponent /> : <EmptyList type="zone" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} addNewForm={() => handleOpenFormSheet()} isRegistered isAdmin isDashboard />
      </>
    )
  }
}