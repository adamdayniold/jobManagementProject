import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  table: {
    margin: 15,
    backgroundColor: 'white'
  },
  headRow: {
    padding: 10,
    borderWidth: 0.2,
    borderColor: '#b4bcbc',
    backgroundColor: '#783916'
  },
  headTextStyle: {
    fontWeight: 'bold',
    color: '#e0d1c1'
  },
  dataRow: {
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#b4bcbc',
    borderLeftWidth: 0.2,
    borderLeftColor: '#b4bcbc'
  },
  lastDataRow: {
    borderRightWidth: 0.2,
    borderRightColor: '#b4bcbc'
  },
  dataAlign: {
    justifyContent: 'center'
  }
});

export default styles;