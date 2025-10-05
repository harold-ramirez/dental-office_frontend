import { RelativePathString, router } from "expo-router";
import { Alert } from "react-native";

export const DeleteAlertMessage = (
  title: string,
  message: string,
  actionButtonText: string,
  apiRoute: string,
  errorMessage: string,
  refreshPath: RelativePathString,
  param?: { [key: string]: string }
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: actionButtonText,
        onPress: async () => {
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;
          try {
            const endpoint = await fetch(`${apiUrl}${apiRoute}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (endpoint.ok) {
              router.replace({
                pathname: refreshPath,
                params: { refresh: Date.now().toString(), ...param },
              });
            } else {
              Alert.alert("Error", errorMessage, [{ text: "OK" }]);
            }
          } catch (error) {
            console.error(errorMessage, error);
          }
        },
        style: "destructive",
      },
    ],
    { cancelable: false }
  );
};
