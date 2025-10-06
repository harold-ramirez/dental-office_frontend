import { registerForPushNotifications } from "@/services/notificationService";
import SocketService from "@/services/socketService";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    registerForPushNotifications();
    SocketService.connect();
    return () => {
      SocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isLoggedIn ? (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
