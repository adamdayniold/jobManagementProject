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
  container: {
    backgroundColor: 'white',
    borderTopColor: '#D3D3D3',
    borderTopWidth: 1
  },
  buttonPIC: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insideButtonPIC: {
    textAlign: 'center'
  },
  welcomeText: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 40,
    color: '#570861'
  },
  detailsText: {
    marginVertical: 5,
    marginHorizontal: 10,
    fontSize: 20,
  }
})

export default styles;