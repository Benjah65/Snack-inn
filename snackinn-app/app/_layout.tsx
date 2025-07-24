import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

export default function Layout() {
  useEffect(() => {
    let lastBackPressed = 0;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const now = Date.now();
      if (now - lastBackPressed < 2000) {
        // Exit app if pressed twice quickly
        return false;
      } else {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        lastBackPressed = now;
        return true;
      }
    });

    return () => backHandler.remove();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
