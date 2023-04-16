import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

const CustomRadioButton = ({ value, select, selected }) => {

  const RadioInput = () => value.map((detailList) => {
    return (
      <TouchableOpacity key={detailList.value} style={selected === detailList.value ? styles.selectedRadio : styles.normalRadio} onPress={() => select(detailList.value)}>
        <Text style={selected === detailList.value ? styles.selectedText : styles.normalText}>{detailList.label}</Text>
      </TouchableOpacity>
    )
  })

  return (
    <>
      <View style={styles.container}>
        {value && value.length > 0 &&
          <>
            <Text>Type:</Text>
            <RadioInput />
          </>
        }
      </View>
    </>
  )
}

export default CustomRadioButton;