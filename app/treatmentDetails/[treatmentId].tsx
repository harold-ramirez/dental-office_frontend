import { PlusIcon } from "@/components/Icons";
import PaymentModal from "@/components/treatments/paymentModal";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TreatmentDetails() {
  const { treatmentId } = useLocalSearchParams();
  const [openModal, setOpenModal] = useState(false);
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
            headerTitle: "Detalle Tratamiento",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-end gap-3 w-full">
          <View className="items-center bg-whiteBlue p-2 rounded-lg w-full">
            <Text className="my-5 font-extrabold text-blackBlue text-4xl">
              ORTODONCIA
            </Text>
            <View className="flex-row justify-between items-center w-full">
              <View className="items-center">
                <Text className="font-bold text-blackBlue">Fecha Inicio:</Text>
                <Text>01/01/2025</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-blackBlue">
                  Piezas Dentales:
                </Text>
                <Text>14 - 16 - 20</Text>
              </View>
              <View className="flex-row">
                <View className="items-end">
                  <Text className="font-bold text-blackBlue">Total: </Text>
                  <Text className="font-bold text-blackBlue">Pagado: </Text>
                  <Text className="font-bold text-blackBlue">A Cuenta: </Text>
                </View>
                <View>
                  <Text>XXXBs.</Text>
                  <Text>XXXBs.</Text>
                  <Text>XXXBs.</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView className="flex-1 border w-full">
            <View className="flex-1 bg-whiteBlue p-3 rounded-lg w-full">
              <View className="px-5 py-3 border-y border-blackBlue">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-blackBlue text-lg">
                    1ra Cuota:
                  </Text>
                  <Text className="text-lg">50Bs.</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-bold text-blackBlue text-lg">
                    Fecha de Pago:
                  </Text>
                  <Text className="text-lg">10/05/2025</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <Pressable
            onPress={() => setOpenModal(true)}
            className="right-4 bottom-4 absolute flex-row justify-center items-center bg-blackBlue rounded-2xl size-16"
          >
            <PlusIcon color="#D6E8EE" size={35} />
          </Pressable>
        </View>
      </SafeAreaView>
      {openModal && <PaymentModal onClose={() => setOpenModal(false)} />}
    </>
  );
}
