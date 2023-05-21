import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
  },
  styling: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white'
  },
  stylingLast: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'column',
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  uploadedSectionWith: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a1adb9',
    marginBottom: 10,
    paddingBottom: 10
  },
  uploadeSectionWithout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})

export default styles;