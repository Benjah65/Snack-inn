import { Stack, useRouter, useSegments } from "expo-router";
import { useState } from "react";
import { BackHandler, ToastAndroid, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [lastBackPress, setLastBackPress] = useState(0);
  // const { width } = useWindowDimensions();

  const isHomePage = segments.length === 1 && segments[0] === "";

  // BACK BUTTON LOGIC
  useFocusEffect(() => {
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

    return () => {
      backHandler.remove();
    };
  });

  // FORCE MOBILE VIEW: Wrap your layout in a container that maxes out at mobile width
  return (
    <View style={{ flex: 1, maxWidth: 480, alignSelf: "center", width: "100%" }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
