import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './src/navigations';

export default function App() {
  return (
    <View style={styles.safeAreaViewAndroid}>
      {/* <SafeAreaView style={styles.safeAreaViewAndroid}> */}
      {/* <SafeAreaProvider> */}
      {/* <GestureHandlerRootView style={styles.gestureHandler}> */}
      <AppNavigator />
      {/* </GestureHandlerRootView> */}
      {/* </SafeAreaProvider> */}
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaViewAndroid: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  gestureHandler: {
    flex: 1
  }
});
