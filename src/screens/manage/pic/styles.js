import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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