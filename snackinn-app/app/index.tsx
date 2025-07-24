// app/index.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://snackinn.netlify.app' }}
        style={styles.webview}
        originWhitelist={['*']}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
// This file is the entry point for the app, rendering the HomeScreen component.
// It uses a WebView to display the SnackInn website, ensuring compatibility with both iOS and Android platforms.
// The SafeAreaView ensures that the content is rendered within the safe area boundaries of a device, especially important for devices with notches or rounded corners.
// The styles are defined to ensure the WebView takes up the full screen, adjusting for the status bar height on Android devices.
// The WebView is configured to allow JavaScript and DOM storage, which is necessary for the SnackInn website to function correctly.
// The originWhitelist is set to allow all origins, which is generally safe for internal apps but should be used cautiously in production apps to avoid security risks.