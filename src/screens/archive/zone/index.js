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

export default function ArchiveZonesListScreen(props) {

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

  const getZone = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = [];
        const listZones = await getDocs(collection(db, 'Events'));
        if (listZones) {
          listZones.forEach((doc) => {
            if (doc.data().deleted === false && doc.data().archived === true) {
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
        onDownload={(url, docName) => downloadFile(url, docName)}
        isEvent
      />
    )
  }

  const EmptyList = ({ type }) => {
    return (
      <View style={styles.emptyListView}>
        <Text style={styles.emptyList}>No {type}</Text>
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
          {allItemData && allItemData.length > 0 ? <ZoneListComponent /> : <EmptyList type="archived events" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} isEvent />
      </>
    )
  }
}