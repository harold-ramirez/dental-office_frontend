import { AuthProvider } from "@/utils/authContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-toast-notifications";
import "./globals.css";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ToastProvider>
  );
}
