import { View } from 'react-native';
import { ListItem, Text, Chip, Badge } from '@rneui/themed';
import TouchableScale from 'react-native-touchable-scale';
import { Grid, Row, Col } from 'react-native-easy-grid';

import styles from './styles';

const CustomListView = ({ listItem, onLongPress, isRegistered, onPress }) => {

  const handleIsRegistered = (type) => {
    if (isRegistered) {
      if (type === 'long') onLongPress(listItem);
      else if (type === 'short') onPress(listItem);
    }
  }

  return (
    <ListItem
      onLongPress={() => handleIsRegistered('long')}
      onPress={() => handleIsRegistered('short')}
      Component={TouchableScale}
      friction={90}
      tension={100}
      activeScale={0.95}
      style={styles.listItem}
      containerStyle={styles.listItemContainer}
    >
      <ListItem.Content>
        <Grid>
          <Row style={[styles.rowWidth, styles.titleRow]}>
            <View>
              <Text style={styles.nameTextStyle}>{listItem?.name}</Text>
            </View>
          </Row>
          <Row style={styles.rowWidth}>
            <Col>
              <View style={styles.dataViewStyle}>
                <Text style={styles.dataTextStyle}>Primer Coat</Text>
                <Badge value={`${listItem?.primerCoat}%`} badgeStyle={styles.badgeStyle}/>
              </View>
              <View style={styles.dataViewStyle}>
                <Text style={styles.dataTextStyle}>Final Coat</Text>
                <Badge value={`${listItem?.finalCoat}%`} badgeStyle={styles.badgeStyle}/>
              </View>
            </Col>
            <Col>
              <View style={styles.dataViewStyle}>
                <Text style={styles.dataTextStyle}>Intermediate</Text>
                <Badge value={`${listItem?.intermediate}%`} badgeStyle={styles.badgeStyle}/>
              </View>
            </Col>
          </Row>
        </Grid>
      </ListItem.Content>
    </ListItem>
  )
}

export default CustomListView;