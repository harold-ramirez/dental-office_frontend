import { registerForPushNotifications } from "@/services/notificationService";
import SocketService from "@/services/socketService";
import { AuthContext } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext, useEffect } from "react";

export { ErrorBoundary } from "expo-router";
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  // Websocket connection
  useEffect(() => {
    if (authState?.isLoggedIn) {
      registerForPushNotifications();
      SocketService.connect();
    }
    return () => {
      SocketService.disconnect();
    };
  }, [authState?.isLoggedIn]);

  if (!authState.isLoggedIn) {
    return <Redirect href={"../login"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
