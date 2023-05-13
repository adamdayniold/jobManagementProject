import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import ProgressLoader from 'rn-progress-loader';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

import CustomProjectListLoader from '../../../components/customProjectListLoader';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomZoneView from '../../../components/view/customZoneView';
import styles from './styles';

export default function ZonesListScreen(props) {

  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [allItemData, setAllItemData] = useState([]);

  useFocusEffect(useCallback(() => {
    async function fetchUserInformation() {
      setIsLoading(true);
      await getZone();
    }
    const userDetails = auth.currentUser;
    if (userDetails) {
      fetchUserInformation();
    }
  }, []))

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
            list.push({
              id: doc.id,
              ...doc.data()
            });
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
        const listZones = await getDocs(collection(db, 'Events'));
        if (listZones) {
          listZones.forEach((doc) => {
            if (doc.data().deleted === false) {
              list.push({
                id: doc.id,
                ...doc.data()
              });
            }
          });
          const sortedZone = list.sort((a, b) => a.dateTime.localeCompare(b.dateTime))
          setAllItemData(sortedZone || []);
        } else {
          setAllItemData([]);
        }
        resolve(true);
        setIsLoading(false);
      } catch (err) {
        resolve(true);
        console.log('Error fetching events list', err);
        setIsLoading(false);
        alertPopup('Error', 'Error fetching events list');
      }
    })
  }

  const ZoneListComponent = () => {
    return (
      <CustomZoneView
        data={allItemData}
        onLongPress={(index) => goTo('ZoneCreation', index)}
        onDownload={(url, docName) => downloadFile(url, docName)}
        isEvent
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
        isNew: false,
        data: allItemData[index]
      })
    } else { props.navigation.navigate(navi) }
  }

  const downloadFile = async (url, docName) => {
    setIsDownloading(true);
    await FileSystem.downloadAsync(
      url, FileSystem.documentDirectory + docName
    );
    Linking.openURL(url);
    setIsDownloading(false);
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);
  if (isLoading) {
    return <CustomProjectListLoader />
  } else if (isDownloading) {
    return (
      <View>
        <ProgressLoader
          visible={true}
          isModal={true}
          isHUD={true}
          hudColor="#525253"
          color="#FAF9F6"
        ></ProgressLoader>
      </View>
    )
  } else {
    return (
      <>
        <ScrollView>
          {allItemData && allItemData.length > 0 ? <ZoneListComponent /> : <EmptyList type="events" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} isEvent />
      </>
    )
  }
}