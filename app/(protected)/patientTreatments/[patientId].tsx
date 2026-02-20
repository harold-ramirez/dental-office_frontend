import { PlusIcon, UserCircleIcon } from "@/components/Icons";
import TreatmentCard from "@/components/treatments/treatmentCard";
import TreatmentModal from "@/components/treatments/treatmentModal";
import { DiagnosedProcedureDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

export default function Treatments() {
  const { patientId } = useLocalSearchParams();
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [procedures, setProcedures] = useState<DiagnosedProcedureDto[]>([]);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchProcedures = useCallback(async () => {
    try {
      const data = await fetchWithToken(
        `/diagnosed-procedure/${patientId}?page=1&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );
      setProcedures(data);
      setPage(1);
      setHasMoreData(data.length === pageSize);
    } catch {
      toast.show("Error al cargar los procedimientos", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    }
  }, [patientId, logOut, pageSize, toast]);

  const fetchMoreProcedures = useCallback(async () => {
    if (isLoadingMore || !hasMoreData) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchWithToken(
        `/diagnosed-procedure/${patientId}?page=${nextPage}&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );

      if (data.length > 0) {
        setProcedures((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMoreData(data.length === pageSize);
      } else {
        setHasMoreData(false);
      }
    } catch {
      // Silent fail for pagination - already have data showing
    } finally {
      setIsLoadingMore(false);
    }
  }, [patientId, page, pageSize, isLoadingMore, hasMoreData, logOut]);

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
          <FlatList
            className="flex-1 w-full"
            data={procedures}
            keyExtractor={(procedure, index) => index.toString()}
            renderItem={({ item }) => <TreatmentCard procedure={item} />}
            contentContainerStyle={{ gap: 12, flexGrow: 1 }}
            onEndReached={() => fetchMoreProcedures()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <View className="py-4 items-center">
                  <ActivityIndicator color="#02457A" size={30} />
                </View>
              ) : null
            }
          />
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
