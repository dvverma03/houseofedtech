import AppNavigator from '@/src/navigation/AppNavigator';
import { navigationRef } from '@/src/navigation/navigationRef';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'expo-notifications functionality is not fully supported in Expo Go',
  'Android push notifications require a development build',
]);

LogBox.ignoreLogs([
  '[expo-av]: Expo AV has been deprecated',
  '[expo-av]: Video component from `expo-av` is deprecated',
  '⚠️ [expo-av]: Video component from `expo-av` is deprecated',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
