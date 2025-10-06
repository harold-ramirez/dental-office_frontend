import { AuthContext } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  const authState = useContext(AuthContext);
  if (!authState) {
    return <Redirect href={"/login"} />;
  }

  // // Websocket connection
  // useEffect(() => {
  //   registerForPushNotifications();
  //   SocketService.connect();
  //   return () => {
  //     SocketService.disconnect();
  //   };
  // }, []);

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
