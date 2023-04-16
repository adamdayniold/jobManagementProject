import React from 'react';
import { Text } from 'react-native'
import { Dialog } from '@rneui/themed';

const CustomDialog = ({ isVisible, onBackdropPress, selectedItem, handleDialog, type }) => {
  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
    >
      <Dialog.Title title={`Delete ${type}?`} />
      <Text>{ selectedItem?.name }</Text>
      <Dialog.Actions>
        <Dialog.Button titleStyle={{ color: 'red' }} title="Confirm" onPress={() => handleDialog('yes')}/>
        <Dialog.Button titleStyle={{ color: '#bcb4b4' }} title="Cancel" onPress={() => handleDialog('no')}/>
      </Dialog.Actions>
    </Dialog>
  )
}

export default CustomDialog;