// import { ListItem } from '@rneui/themed';
import { View, Text } from "react-native";
import styles from './styles';
import moment from 'moment';
import { Button, ListItem } from "@rneui/themed";

const CustomZoneView = ({ data, currentUserInformation }) => {

  const ZoneView = () => data.map(details => {
    const ConstructorList = () => details?.constructorDetails?.map((user) => {
      return (
        <View key={user.id} style={styles.employeeConstructor}>
          <Text style={currentUserInformation && currentUserInformation.uid === user.id ? styles.currentData : ''}>Name: {user.name} | Email: {user.email}</Text>
        </View>
      )
    })

    const EmployeeList = () => data?.employeeDetails?.map((user) => {
      return (
        <View key={user.id} style={styles.employeeConstructor}>
          <Text style={currentUserInformation && currentUserInformation.uid === user.id ? styles.currentData : ''}>Name {user.name} | Email: {user.email}</Text>
        </View>
      )
    })

    return (
      <View key={details.id} style={styles.container}>
        <View style={styles.styling}>

          <View style={details.employeeList.length > 0 || details.constructorList.length > 0 ? styles.headerSection : ''}>
            <View style={styles.header}>
              <View>
                <Text>Name: {details?.name}</Text>
              </View>
              <View>
                <Text>Time: {details?.dateTime ? moment(details.dateTime).format('DD MMM YYYY') : ''}</Text>
              </View>
            </View>
            <View style={styles.zoneNameHeader}>
              <Text>Zone name: {details?.zoneName}</Text>
            </View>
            <View style={styles.descHeader}>
              <Text>Description:</Text>
              <Text>{details?.description}</Text>
            </View>
          </View>
          {details.constructorList.length > 0 &&
            <View style={styles.listOfEmp}>
              <Text>List of constructor:-</Text>
              <ConstructorList />
            </View>
          }
          {details.employeeList.length > 0 &&
            <View style={styles.listOfEmp}>
              <Text>List of employee:-</Text>
              <EmployeeList />
            </View>
          }
        </View>
      </View>
    )
  })

  return (
    <>
      <ZoneView />
    </>
  )
}

export default CustomZoneView;