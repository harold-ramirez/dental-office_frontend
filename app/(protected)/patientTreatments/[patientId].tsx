import { PlusIcon, UserCircleIcon } from "@/components/Icons";
import TreatmentCard from "@/components/treatments/treatmentCard";
import TreatmentModal from "@/components/treatments/treatmentModal";
import { DiagnosedProcedureDto } from "@/interfaces/interfaces";
import { authService } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Treatments() {
  const { patientId } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [procedures, setProcedures] = useState<DiagnosedProcedureDto[]>([]);

  const fetchProcedures = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const data = await fetch(`${API_URL}/diagnosed-procedure/${patientId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setProcedures(data);
    } catch (error) {
      console.log("Error fetching Diagnosed Procedures:", error);
    }
  }, [patientId]);

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
            headerTitle: "Tratamientos Realizados",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-center bg-whiteBlue p-2 rounded-xl w-full">
          <UserCircleIcon size={100} color="#02457A" />
          <Text className="text-blackBlue text-lg mt-5 mb-2 w-full font-semibold">
            Tratamientos recientes:
          </Text>
          <View className="flex-1 w-full gap-3">
            {procedures.map((procedure, i) => (
              <TreatmentCard procedure={procedure} key={i} />
            ))}
          </View>
          <Pressable
            onPress={() => setShowModal(true)}
            className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-2 rounded-full w-3/5"
          >
            <PlusIcon color="#D6E8EE" size={32} />
            <Text className="font-semibold text-whiteBlue">
              Nuevo Tratamiento
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
      {showModal && (
        <TreatmentModal
          patientId={+patientId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
