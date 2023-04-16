import React from 'react'
import { ActivityIndicator, Text, Pressable } from 'react-native'
import styles from './styles';

const CustomButton = ({ onPress, text, btnColor, txtColor, loading, disable }) => {
  return (
    <Pressable onPress={onPress} disabled={disable || loading} style={[styles.container, { backgroundColor: btnColor }]}>
      { loading ? <ActivityIndicator size="small" color={txtColor}/> : <Text style={[styles.text, { color: txtColor }]}>{text}</Text>}
    </Pressable>
  )
}

export default CustomButton;