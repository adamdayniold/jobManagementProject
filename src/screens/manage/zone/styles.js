import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: '0%'
  },
  register: {
    fontSize: 50,
    fontWeight: 500,
    color: '#9A6BA0',
    marginBottom: 10
  },
  safeAreaContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#f7f7f7'
  },
  dropdownContainer: {
    backgroundColor: '#37d5d2a2',
    paddingTop: 30,
    marginBottom: 20,
    flex: 1
  },
  dropdown: {
    width: '100%',
    height: 50,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginVertical: 10,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    padding: 13,
    marginVertical: 5,
    width: '100%'
  },
  touchableSelectDate: {
    width: '100%'
  },
  documentSee: {
    borderWidth: 1,
    borderColor: 'red',
    height: 70,
    width: '100%',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  documentElseSee: {
    borderWidth: 1,
    borderColor: 'grey',
    height: 70,
    width: '100%',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  documentLogo: {
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: 'red',
    color: 'white',
    width: 50,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  txtLogo: {
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'grey',
    color: 'white',
    width: 50,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  documentContent: {
    flex: 1,
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    padding: 5
  }
})

export default styles;