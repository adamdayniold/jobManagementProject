import React from 'react'
import { View, TextInput } from 'react-native';
import styles from './styles';

const CustomInput = ({ value, setValue, placeholder, placeholderTextColor, secureTextEntry, keyboardType }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={styles.inputStyle}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  )
}

export default CustomInput;