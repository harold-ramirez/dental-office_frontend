import { fetchWithToken } from "@/services/fetchData";
import { useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import PasswordInput from "../passwordInput";

export default function LogInModal({
  onClose,
  onSubmit,
  logOut,
}: {
  onClose: () => void;
  onSubmit: () => void;
  logOut: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [onClose]);

  const handleConfirmPassword = async () => {
    if (password === "") {
      toast.show("Ingrese su contraseña", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const data = await fetchWithToken(
        "/auth/confirm-password",
        {
          method: "POST",
          body: JSON.stringify({ password: password }),
        },
        logOut,
      );
      if (data.confirmed) {
        onSubmit();
        onClose();
      }
    } catch (e: any) {
      console.log("Error confirming password:", e);
      const errorMessage = e.message || "Error desconocido";
      if (errorMessage.includes("403")) {
        toast.show("Contraseña incorrecta", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      } else {
        toast.show(
          "Error en la confirmación de la contraseña. Intente nuevamente",
          {
            type: "danger",
            placement: "top",
            duration: 3000,
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="absolute inset-0 z-50">
      <View className="absolute inset-0 bg-black/75" />
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 justify-center items-center"
      >
        <View className="gap-2 bg-lightBlue px-5 py-2 rounded-xl w-4/5">
          <Text className="font-bold text-blackBlue text-2xl text-center">
            Ingrese su Contraseña{`\n`}para editar
          </Text>

          <View className="flex-row items-center gap-2">
            <PasswordInput
              value={password}
              setValue={(val) => setPassword(val)}
              className="flex-row flex-1 items-center gap-1 bg-whiteBlue rounded-lg h-12"
              placeholder="Contraseña actual"
              disabled={loading}
            />
          </View>

          <Pressable
            onPress={() => handleConfirmPassword()}
            className="justify-center items-center bg-darkBlue active:bg-blackBlue mt-5 p-2 rounded-full"
          >
            <Text className="font-semibold text-whiteBlue">Confirmar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
