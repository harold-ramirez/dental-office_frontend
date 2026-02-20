import { AddPatientIcon, SadIcon, SearchIcon } from "@/components/Icons";
import PatientCard from "@/components/patients/patientCard";
import { CreatePatientModal } from "@/components/patients/patientModal";
import { PatientDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

export default function Patients() {
  const params = useLocalSearchParams();
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientDto[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Cantidad de pacientes por página
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchAllPatients = useCallback(async () => {
    try {
      setHasError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const endpoint = await fetchWithToken(
        `/patients?page=1&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );
      clearTimeout(timeoutId);
      setPatients(endpoint);
      setPage(1);
      setHasMoreData(endpoint.length === pageSize);
    } catch {
      toast.show("Error al cargar los pacientes", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      setHasError(true);
    }
  }, [logOut, pageSize, toast]);

  const fetchMorePatients = useCallback(async () => {
    if (isLoadingMore || !hasMoreData || searchValue.trim() !== "") return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const endpoint = await fetchWithToken(
        `/patients?page=${nextPage}&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );
      clearTimeout(timeoutId);

      if (endpoint.length > 0) {
        setPatients((prev) => [...prev, ...endpoint]);
        setPage(nextPage);
        setHasMoreData(endpoint.length === pageSize);
      } else {
        setHasMoreData(false);
      }
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, pageSize, isLoadingMore, hasMoreData, searchValue, logOut]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    await fetchAllPatients();
    setSearchValue("");
    setRefreshing(false);
  }, [fetchAllPatients]);

  useEffect(() => {
    const handleSearch = setTimeout(async () => {
      if (searchValue.trim() === "") {
        setFilteredPatients(patients);
        return;
      }

      try {
        const results = await fetchWithToken(
          `/patients/search/${searchValue}`,
          { method: "GET" },
          logOut,
        );
        setFilteredPatients(results);
      } catch {
        setFilteredPatients([]);
      }
    }, 500);
    return () => clearTimeout(handleSearch);
  }, [searchValue, patients, logOut]);

  useEffect(() => {
    onRefresh();
  }, [params.refresh, onRefresh]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await fetchWithToken(
          "/users/wa-message",
          { method: "GET" },
          logOut,
        );
        setWhatsappMessage(data.defaultMessage);
      } catch {}
    };
    fetchMessage();
  }, [logOut]);

  return (
    <>
      <LinearGradient
        colors={["#001B48", "#018ABE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}
      >
        <View className="flex-1 items-center gap-3">
          <Text className="font-bold text-white text-3xl">Mis Pacientes</Text>
          {/* Search Bar */}
          <View className="flex-row items-center bg-whiteBlue pl-2 rounded-lg w-full h-12 text-lg">
            <SearchIcon color="gray" size={30} />
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="gray"
              value={searchValue}
              onChangeText={setSearchValue}
              className="flex-1 p-2 h-full text-xl"
            />
          </View>

          <View className="items-end w-full">
            <Pressable
              onPress={() => setShowNewPatient(true)}
              className="flex-row justify-center items-center gap-1 bg-blackBlue active:bg-pureBlue px-5 py-2 rounded-full"
            >
              <AddPatientIcon color="white" />
              <Text className="text-white">Nuevo Paciente</Text>
            </Pressable>
          </View>
          {refreshing ? (
            <ActivityIndicator
              className="flex-1 justify-center items-center"
              color={"#fff"}
              size={50}
            />
          ) : hasError ? (
            <View className="flex-1 justify-center items-center gap-4">
              <SadIcon color="#9ca3af" size={100} />
              <Text className="font-bold text-gray-400 text-lg text-center">
                Error al cargar los pacientes
              </Text>
              <Pressable
                onPress={onRefresh}
                className="bg-blackBlue active:bg-pureBlue px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              className="flex-1 w-full"
              data={filteredPatients}
              keyExtractor={(patient) => patient.Id.toString()}
              renderItem={({ item }) => (
                <PatientCard
                  defaultMessage={whatsappMessage}
                  patient={item}
                  openId={openId}
                  setOpenId={setOpenId}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ gap: 12, flexGrow: 1 }}
              onEndReached={() => fetchMorePatients()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator color="#fff" size={30} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center">
                  <SadIcon color="#9ca3af" size={100} />
                  <Text className="font-bold text-gray-400 text-xl italic">
                    {searchValue.trim() !== ""
                      ? "No se encontraron resultados"
                      : "No hay pacientes registrados"}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {showNewPatient && (
        <CreatePatientModal
          onClose={() => {
            setShowNewPatient(false);
          }}
        />
      )}
    </>
  );
}
