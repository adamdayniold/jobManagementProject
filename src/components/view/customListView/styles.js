import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  listItem: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  listItemContainer: {
    backgroundColor: '#793914',
    borderColor: '#b4bcbc',
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: 15,
  },
  rowWidth: {
    width: '100%'
  },
  titleRow: {
    justifyContent: 'center',
    marginBottom: 10
  },
  nameTextStyle: {
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#f4f4f4'
  },
  dataTextStyle: {
    color: '#eceae9',
  },
  badgeStyle: {
    backgroundColor: '#cb852b',
    borderWidth: 0
  },
  dataViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 2
  }
});

export default styles;