import { View } from 'react-native';
import { Facebook } from 'react-content-loader/native';
import { ListItem } from '@rneui/themed';

const CustomProjectListLoader = () => {

  const FacebookLoader = () => <Facebook />

  return (
    <View>
      <ListItem bottomDivider>
        <FacebookLoader/>
      </ListItem>
      <ListItem bottomDivider>
        <FacebookLoader/>
      </ListItem>
      <ListItem bottomDivider>
        <FacebookLoader/>
      </ListItem>
      <ListItem bottomDivider>
        <FacebookLoader/>
      </ListItem>
      <ListItem bottomDivider>
        <FacebookLoader/>
      </ListItem>
    </View>
  )
}

export default CustomProjectListLoader;