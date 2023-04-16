import { View } from 'react-native';
import { List } from 'react-content-loader/native';
import styles from './styles';

const CustomComponentListLoader = () => {

  const Listloader = () => <List/>

  return (
    <View>
      <View style={styles.listItem}><Listloader/></View>
      <View style={styles.listItem}><Listloader/></View>
      <View style={styles.listItem}><Listloader/></View>
      <View style={styles.listItem}><Listloader/></View>
      <View style={styles.listItem}><Listloader/></View>
      <View style={styles.listItem}><Listloader/></View>
    </View>
  )
}

export default CustomComponentListLoader;