import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
  },
  styling: {
    borderColor: 'grey',
    borderWidth: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 1,
    marginBottom: 5
  },
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  zoneNameHeader: {
    paddingBottom: 1,
    marginBottom: 5
  },
  descHeader: {
    marginBottom: 5,
  },
  employeeConstructor: {
    flexDirection: 'row'
  },
  listOfEmp: {
    marginVertical: 5,
  },
  currentData: {
    fontWeight: 'bold'
  }
})

export default styles;