import { useState } from 'react';
import { Modal, View, Text, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';

import styles from './styles';

const CustomBottomDrawer = ({ drawerCondition, closeDrawer, onSubmit }) => {
  const windowHeight = Dimensions.get('window').height;
  const [commentInput, setCommentInput] = useState('');

  const submitComment = () => {
    onSubmit(commentInput)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={drawerCondition}
      onRequestClose={() => closeDrawer()}>

      <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setCommentInput(text)}
            value={commentInput}
            multiline
            numberOfLines={3}
            placeholderTextColor='#a1adb9'
            placeholder="Comment"
          />
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#a1adb9', backgroundColor: 'white', flex: 1, marginRight: 2 }}>
            <TouchableWithoutFeedback onPress={() => closeDrawer()}>
              <View>
                <Text style={{ textAlign: 'center', color: 'black', padding: 4 }}>Cancel</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#570861', backgroundColor: '#570861', flex: 1, marginLeft: 2 }}>
            <TouchableWithoutFeedback onPress={() => submitComment()}>
              <View>
                <Text style={{ textAlign: 'center', color: 'white', padding: 4 }}>Submit</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CustomBottomDrawer;
