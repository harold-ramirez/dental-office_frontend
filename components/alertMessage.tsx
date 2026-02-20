import { fetchWithToken } from "@/services/fetchData";
import { RelativePathString, router } from "expo-router";
import { Alert } from "react-native";
import { Toast } from "react-native-toast-notifications";

export const DeleteAlertMessage = (
  title: string,
  message: string,
  actionButtonText: string,
  apiRoute: string,
  errorMessage: string,
  httpMethod: string,
  refreshPath: RelativePathString,
  logOut: () => void,
  toast: typeof Toast,
  param?: { [key: string]: string },
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
          try {
            await fetchWithToken(apiRoute, { method: httpMethod }, logOut);
            router.replace({
              pathname: refreshPath,
              params: { refresh: Date.now().toString(), ...param },
            });
          } catch (error) {
            console.log(error);
            toast.show(errorMessage, {
              type: "danger",
              placement: "top",
              duration: 3000,
            });
          }
        },
        style: "destructive",
      },
    ],
    { cancelable: false },
  );
};
