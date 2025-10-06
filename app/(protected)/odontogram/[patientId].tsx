import { EditIcon } from "@/components/Icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Odontogram() {
  const { patientId } = useLocalSearchParams();
  const [isAdultModel, setIsAdultModel] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

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
            headerTitle: "Odontograma",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 gap-2 w-full">
          <View className="flex-row justify-between">
            <Pressable
              onPress={() => setIsAdultModel(!isAdultModel)}
              disabled={isEditMode ? false : true}
              android_ripple={{ color: "#018ABE" }}
              className="bg-whiteBlue px-5 py-1 border-2 border-blackBlue rounded-lg"
            >
              <Text className="font-semibold text-blackBlue text-lg">
                Modelo: {isAdultModel ? "Adulto" : "Niño"}
              </Text>
            </Pressable>

            <Pressable
              onPress={
                isEditMode
                  ? () => setIsEditMode(false) //Save
                  : () => setIsEditMode(true)
              }
              android_ripple={{ color: "#018ABE" }}
              className="flex-row justify-center items-center gap-2 bg-darkBlue px-5 py-1 rounded-md"
            >
              <EditIcon color="#D6E8EE" size={20} />
              <Text className="font-semibold text-whiteBlue text-lg">
                {isEditMode ? "Guardar" : "Editar"}
              </Text>
            </Pressable>
          </View>

          {/* 3D Odontogram */}
          <View className="flex-1 bg-blackBlue/50"></View>

          {/* Markup Legend */}
          <View className="flex-row gap-5 bg-whiteBlue mb-2 p-2 rounded-lg">
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-green-500 rounded-full size-6" />
                <Text className="text-blackBlue">Prótesis Maladaptada</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="bg-black rounded-full size-6" />
                <Text className="text-blackBlue">Diente Ausente</Text>
              </View>
            </View>
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-red-500 rounded-full size-6" />
                <Text className="text-blackBlue">Cáries / LC</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="bg-blue-500 rounded-full size-6" />
                <Text className="text-blackBlue">Implante</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
