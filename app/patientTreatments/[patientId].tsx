import { PlusIcon, UserCircleIcon } from "@/components/Icons";
import TreatmentCard from "@/components/treatments/treatmentCard";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Treatments() {
  const { patientId } = useLocalSearchParams();

  return (
    <>
      <LinearGradient
        colors={["#97CADB", "#018ABE", "#97CADB"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 8,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "Tratamientos Realizados",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-center bg-whiteBlue p-2 rounded-xl w-full">
          <UserCircleIcon size={100} color="#02457A" />
          <View className="flex-1 w-full mt-5">
            <TreatmentCard treatmentId="123" />
          </View>
          <Pressable className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-2 rounded-full w-3/5">
            <PlusIcon color="#D6E8EE" size={32} />
            <Text className="font-semibold text-whiteBlue">
              Nuevo Tratamiento
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
