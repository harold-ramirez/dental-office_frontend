import { ProfileIconAlt } from "@/components/Icons";
import PasswordInput from "@/components/passwordInput";
import { authService } from "@/services/authService";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!formData.user || !formData.password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: formData.user,
        password: formData.password,
      });

      authContext.logIn(response.token);
    } catch (error: any) {
      Alert.alert(
        "Error de inicio de sesión",
        error.message || "Usuario o contraseña incorrectos",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <LinearGradient
        colors={["#02457A", "#018ABE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute top-0 bottom-0 right-0 left-0"
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="absolute items-center w-full h-full"
      >
        <ScrollView
          className="w-full h-full flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full h-full flex-1 items-center justify-center">
            {/* Image Banner */}
            <View
              className="items-center bg-whiteBlue p-5"
              style={{
                width: "96%",
                borderTopWidth: 0,
                borderRadius: 30,
                borderTopEndRadius: 0,
                borderTopLeftRadius: 0,
              }}
            >
              <Image
                source={require("../assets/images/adaptive-icon.png")}
                style={{ width: 300, height: 200 }}
              />
            </View>

            <View className="gap-10 pt-16">
              <Text className="font-bold text-whiteBlue text-4xl">
                Mi Consultorio Dental
              </Text>
              <LinearGradient
                colors={["#FFFFFF1A", "#FFFFFF4D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="items-center gap-5 blur-xl p-5 border border-whiteBlue/30 rounded-xl w-4/5"
                style={{
                  borderRadius: 12,
                }}
              >
                <Text className="font-bold text-white text-4xl">
                  Bienvenido
                </Text>
                <View className="flex-row items-center gap-1 bg-whiteBlue rounded-lg h-14">
                  <ProfileIconAlt color="#001B48" size={21} className="pl-2" />
                  <TextInput
                    className="flex-1 text-blackBlue"
                    placeholder="Ingrese su Usuario..."
                    placeholderTextColor={"gray"}
                    value={formData.user}
                    onChangeText={(text) =>
                      setFormData({ ...formData, user: text })
                    }
                    editable={!loading}
                  />
                </View>
                <PasswordInput
                  value={formData.password}
                  setValue={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  disabled={loading}
                  placeholder="Ingrese su Contraseña..."
                />

                {/* Login Button */}
                <Pressable
                  onPress={handleLogin}
                  disabled={loading}
                  android_ripple={{ color: "#018ABE" }}
                  className={`${
                    loading ? "bg-gray-400" : "bg-blackBlue"
                  } mt-5 px-5 py-2 border border-whiteBlue rounded-lg`}
                >
                  <Text className="font-semibold text-whiteBlue text-lg">
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
