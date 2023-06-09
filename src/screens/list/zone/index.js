import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import ProgressLoader from 'rn-progress-loader';

import { auth, db } from '../../../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

import CustomProjectListLoader from '../../../components/customProjectListLoader';
import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomZoneView from '../../../components/view/customZoneView';
import styles from './styles';

export default function ZonesListScreen(props) {

  const [userUID, setUserUID] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [allItemData, setAllItemData] = useState([]);
  const [userData, setUserData] = useState({});

  useFocusEffect(useCallback(() => {
    async function fetchUserInformation() {
      setIsLoading(true);
      await getUser(userDetails.uid);
      await getZone();
    }
    const userDetails = auth.currentUser;
    setUserUID(userDetails.uid)
    if (userDetails) {
      fetchUserInformation();
    }
  }, []))

  const getUser = async (userID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = {};
        const usersRef = collection(db, "Users");
        const usersList = await getDocs(usersRef);
        if (usersList) {
          usersList.forEach((doc) => {
            if (doc.id === userID) {
              list['id'] = doc.id;
              list['name'] = doc.data().name;
              list['email'] = doc.data().email;
              list['company'] = doc.data().company;
              list['designation'] = doc.data().designation;
            }
          });
          resolve(list);
          setUserData(list);
        }
      } catch (err) {
        resolve(false);
        console.error('Error fetching uploader information', err);
        alertPopup('Error', 'Error fetching uploader information', false);
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
            if (doc.data().deleted === false && doc.data().archived === false) {
              list.push({
                id: doc.id,
                ...doc.data()
              });
            }
          });
          const sortedZone = list.sort((a, b) => b.dateTime - a.dateTime)
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
        onSubmitComment={(dataRow) => onSubmitComment(dataRow)}
        userData={userData}
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

  const onSubmitComment = async (dataRow) => {
    setIsLoading(true);
    const documentRef = doc(db, "Events", dataRow.id);
    await updateDoc(documentRef, {
      comments: dataRow.comments
    })
    await getZone();
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
        <ScrollView keyboardShouldPersistTaps="persist">
          {allItemData && allItemData.length > 0 ? <ZoneListComponent /> : <EmptyList type="events" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} isEvent />
      </>
    )
  }
}