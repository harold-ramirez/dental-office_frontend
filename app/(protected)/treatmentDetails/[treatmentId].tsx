import { PlusIcon } from "@/components/Icons";
import PaymentModal from "@/components/treatments/paymentModal";
import { authService } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TreatmentDetails() {
  const { treatmentId } = useLocalSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [treatmentDetails, setTreatmentDetails] = useState<{
    totalPaid: number;
    totalDue: number;
    description: string;
    totalCost: number;
    treatment: string;
    registerDate: string;
    totalPieces: number[];
    payments: { Id: number; amount: number; registerDate: string }[];
  }>({
    totalPaid: 0,
    totalDue: 0,
    description: "",
    totalCost: 0,
    treatment: "",
    registerDate: "",
    totalPieces: [],
    payments: [],
  });

  const fetchProcedures = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const data = await fetch(`${API_URL}/payments/procedure/${treatmentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setTreatmentDetails(data);
    } catch (error) {
      console.log("Error fetching treatment Details:", error);
    }
  }, [treatmentId]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

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
              {treatmentDetails.treatment}
            </Text>
            <Text className="mb-5 text-blackBlue italic">
              {treatmentDetails.description}
            </Text>
            <View className="flex-row justify-between items-center w-full">
              <View className="items-center">
                <Text className="font-bold text-blackBlue">Fecha Inicio:</Text>
                <Text>
                  {new Date(treatmentDetails.registerDate).toLocaleDateString(
                    "es-BO",
                  )}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-blackBlue">
                  Piezas Dentales:
                </Text>
                <Text>{treatmentDetails.totalPieces.join(" - ")}</Text>
              </View>
              <View className="flex-row">
                <View className="items-end">
                  <Text className="font-bold text-blackBlue">Total: </Text>
                  <Text className="font-bold text-blackBlue">Pagado: </Text>
                  <Text className="font-bold text-blackBlue">A Cuenta: </Text>
                </View>
                <View className="items-end">
                  <Text>{treatmentDetails.totalCost}Bs.</Text>
                  <Text>{treatmentDetails.totalPaid}Bs.</Text>
                  <Text>{treatmentDetails.totalDue}Bs.</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView className="flex-1 w-full">
            <View className="flex-1 bg-whiteBlue p-3 rounded-lg w-full">
              {treatmentDetails.payments.length === 0 ? (
                <Text className="text-blackBlue text-center italic">
                  No hay pagos registrados
                </Text>
              ) : (
                treatmentDetails.payments.map((payment, i) => (
                  <View key={i} className="px-5 py-3 border-blackBlue border-y">
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-blackBlue text-lg">
                        {i + 1}° Cuota:
                      </Text>
                      <Text className="text-lg">{payment.amount}Bs.</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-blackBlue text-lg">
                        Fecha de Pago:
                      </Text>
                      <Text className="text-lg">
                        {new Date(payment.registerDate).toLocaleDateString(
                          "es-BO",
                        )}
                      </Text>
                    </View>
                  </View>
                ))
              )}
              {treatmentDetails.totalDue === 0 && (
                <View className="flex-row items-center gap-2 mt-5">
                  <View className="flex-1 border-darkBlue border-t-2 border-dashed" />
                  <Text className="font-semibold text-darkBlue text-center">
                    Pago del Tratamiento{`\n`}Completado
                  </Text>
                  <View className="flex-1 border-darkBlue border-t-2 border-dashed" />
                </View>
              )}
            </View>
          </ScrollView>
          {treatmentDetails.totalDue > 0 && (
            <Pressable
              onPress={() => setOpenModal(true)}
              className="right-4 bottom-4 absolute flex-row justify-center items-center bg-blackBlue rounded-2xl size-16"
            >
              <PlusIcon color="#D6E8EE" size={35} />
            </Pressable>
          )}
        </View>
      </SafeAreaView>
      {openModal && (
        <PaymentModal
          onRefresh={fetchProcedures}
          procedureId={+treatmentId}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
}
