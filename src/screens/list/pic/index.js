import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking'
import ProgressLoader from 'rn-progress-loader';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

import CustomProjectSpeedDial from '../../../components/customProjectSpeedDial';
import CustomSwipableListView from '../../../components/view/customSwipableListView';
import CustomProjectListLoader from '../../../components/customProjectListLoader';
import styles from './styles';
import CustomZoneView from '../../../components/view/customZoneView';

export default function PICListScreen(props) {

  const [userItem, setUserItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [allItemData, setAllItemData] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchUserInformation = async () => {
      setIsLoading(true);
      await getPIC();
    }
    const userDetails = auth.currentUser;
    if (userDetails) {
      fetchUserInformation();
    }
  }, []))

  const getPIC = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = [];
        const picRef = collection(db, "PIC");
        const picList = await getDocs(picRef);
        if (picList) {
          picList.forEach((doc) => {
            if (doc.data().deleted === false) {
              list.push({
                id: doc.id,
                ...doc.data()
              })
            }
          })
          const sortedPIC = list.sort((a, b) => a.picName.localeCompare(b.picName));
          setAllItemData(sortedPIC || []);
        } else {
          setAllItemData([]);
        }
        resolve(true);
        setIsLoading(false);
      } catch (err) {
        resolve(true);
        console.error('Error fetching PIC list', err);
        setIsLoading(false);
        alertPopup('Error', 'Error fetching PIC list');
      }
    })
  }

  const ZoneListComponent = () => {
    return (
      <CustomZoneView
        data={allItemData}
        onLongPress={(index) => goTo('PICCreation', index)}
        onDownload={(url, docName) => downloadFile(url, docName)}
        isPIC
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
    if (navi === 'PICCreation') {
      props.navigation.navigate(navi, {
        isNew: false,
        data: allItemData[index],
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
          {allItemData && allItemData.length > 0 ? <ZoneListComponent /> : <EmptyList type="PIC" />}
        </ScrollView>
        <CustomProjectSpeedDial outsideProps={props} isPIC />
      </>
    )
  }
}