import { useEffect } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LogInModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [onClose]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/75 w-full h-full"
    >
      <View className="absolute justify-center items-center w-full h-full">
        <View className="gap-2 bg-whiteBlue px-5 py-2 rounded-xl w-4/5">
          <Text className="font-bold text-blackBlue text-2xl text-center">
            Ingrese su Contraseña{`\n`}para editar
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-blackBlue">Usuario:</Text>
            <TextInput className="flex-1 p-1 border border-blackBlue rounded-lg text-center" />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-blackBlue">Contraseña:</Text>
            <TextInput
              secureTextEntry={true}
              className="flex-1 bg-whiteBlue p-1 border rounded-md text-center"
            />
          </View>

          <Pressable
            onPress={() => {
              onSubmit();
              onClose();
            }}
            className="justify-center items-center bg-darkBlue active:bg-blackBlue mt-5 p-2 rounded-full"
          >
            <Text className="font-semibold text-whiteBlue">Confirmar</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
