import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  emptyListView: {
    marginVertical: 15,
    marginHorizontal: 20,
    padding: 10,
    borderColor: '#b4bcbc',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#793914'
  },
  emptyList: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: 'white'
  },
  buttonPIC: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insideButtonPIC: {
    textAlign: 'center'
  }
})

export default styles;