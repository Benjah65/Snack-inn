import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useCallback } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [lastBackPress, setLastBackPress] = useState<number>(0);

  const isHomePage = segments.length === 1 && segments[0] === ""; // root "/"

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isHomePage) {
          const now = Date.now();
          if (now - lastBackPress < 2000) {
            BackHandler.exitApp();
          } else {
            ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
            setLastBackPress(now);
            return true;
          }
        } else {
          router.back();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => backHandler.remove();
    }, [isHomePage, lastBackPress, router])
  );

  return <Stack screenOptions={{ headerShown: false }} />;
}
