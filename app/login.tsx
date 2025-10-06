import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  ProfileIconAlt,
} from "@/components/Icons";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  // const router = useRouter();

  // const handleLogin = () => {
  //   router.replace("/(protected)/(tabs)");
  // };
  const [peekPassword, setPeekPassword] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const authContext = useContext(AuthContext);

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="absolute justify-center w-full h-full"
      >
        <LinearGradient
          colors={["#001B48", "#018ABE", "#001B48"]}
          className="top-0 right-0 left-0 absolute h-full"
        />

        <View
          style={{ marginTop: -72 }}
          className="justify-center items-center"
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 200, height: 200, marginBottom: 48 }}
            className="rounded-full"
          />

          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.3)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="items-center gap-5 blur-xl p-5 border border-whiteBlue/30 rounded-xl w-4/5"
            style={{
              borderRadius: 12,
            }}
          >
            <Text className="font-bold text-white text-4xl">Bienvenido</Text>

            <View className="flex-row items-center gap-1 bg-whiteBlue rounded-lg h-14">
              <ProfileIconAlt color="#001B48" size={21} className="pl-2" />
              <TextInput
                className="flex-1"
                placeholder="Ingrese su Usuario..."
                value={formData.user}
                onChangeText={(text) =>
                  setFormData({ ...formData, user: text })
                }
              />
            </View>
            <View className="flex-row items-center gap-1 bg-whiteBlue rounded-lg h-14">
              <LockIcon color="#001B48" size={28} className="pl-2" />
              <TextInput
                className="flex-1"
                placeholder="Ingrese su Contraseña..."
                secureTextEntry={!peekPassword}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />
              <Pressable
                className="justify-center items-center p-1 h-full"
                onPress={() => setPeekPassword(!peekPassword)}
              >
                {peekPassword ? (
                  <EyeIcon color="#999999" size={16} />
                ) : (
                  <EyeSlashIcon color="#999999" size={16} />
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={authContext.logIn}
              android_ripple={{ color: "#018ABE" }}
              className="bg-blackBlue mt-5 px-5 py-2 border border-whiteBlue rounded-lg"
            >
              <Text className="font-semibold text-whiteBlue text-lg">
                Iniciar Sesión
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
