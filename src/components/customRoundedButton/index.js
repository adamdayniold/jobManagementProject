import React from 'react'
import { View, ActivityIndicator, Text, Pressable } from 'react-native'
import { Icon } from '@rneui/themed';
import styles from './styles';

const CustomRoundedButton = ({ onPress, icon, type, color, disable }) => {
  return (
    <Pressable onPress={onPress} disabled={disable} style={styles.container}>
      <Icon raised name={icon} type={type} color={color} />
    </Pressable>
  )
}

export default CustomRoundedButton;