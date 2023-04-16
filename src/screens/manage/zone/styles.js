import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  register: {
    fontSize: 50,
    fontWeight: 500,
    color: '#9A6BA0',
    marginBottom: 10
  },
  safeAreaContainer: {
    flex: 1,
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
  }
})

export default styles;