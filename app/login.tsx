import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <>
      <View className="flex-1 items-center justify-center">
        <LinearGradient
          colors={["#97CADB", "#001B48"]}
          className="absolute left-0 right-0 top-0 h-full"
        />
        <View className="border border-red-500 p-10 rounded-xl bg-darkBlue">
          <Text className="text-4xl font-bold text-white mb-4">Bienvenido</Text>
          <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
      </View>
    </>
  );
}
