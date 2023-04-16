import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 5,
    alignItems: 'center'
  },

  selectedRadio: {
    borderColor: '#570861',
    backgroundColor: '#570861',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10
  },

  normalRadio: {
    borderColor: '#e8e8e8',
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10
  },

  selectedText: {
    color: 'white'
  },

  normalText: {
    color: '#a1adb9'
  }
});

export default styles;