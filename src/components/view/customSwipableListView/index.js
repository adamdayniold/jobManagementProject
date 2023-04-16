// import { ListItem } from '@rneui/themed';
import { Button, ListItem } from '@rneui/base';

const CustomSwipableListView = ({ list }) => {

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{list.name}</ListItem.Title>
        <ListItem.Subtitle>{list?.email}</ListItem.Subtitle>
        <ListItem.Subtitle>{list?.type}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export default CustomSwipableListView;