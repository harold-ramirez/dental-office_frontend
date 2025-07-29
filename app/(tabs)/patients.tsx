import { AddPatientIcon, SadIcon, SearchIcon } from "@/components/Icons";
import PatientCard from "@/components/patients/patientCard";
import { CreatePatientModal } from "@/components/patients/patientModal";
import { PatientDto } from "@/interfaces/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

export default function Patients() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const params = useLocalSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientDto[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);

  const fetchAllPatients = useCallback(async () => {
    try {
      const endpoint = await fetch(`${apiUrl}/patients`);
      const data = await endpoint.json();
      setPatients(data);
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  }, [apiUrl]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllPatients();
    setSearchValue("");
    setRefreshing(false);
  }, [fetchAllPatients]);

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      const filter = patients.filter((p) =>
        `${p.name} ${p.paternalSurname ?? ""} ${p.maternalSurname ?? ""}`
          .toLowerCase()
          .includes(searchValue.trim().toLowerCase())
      );
      setFilteredPatients(filter);
    }, 500);
    return () => clearTimeout(handleSearch);
  }, [searchValue, patients]);

  useEffect(() => {
    onRefresh();
  }, [params.refresh, onRefresh]);

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
          <View className="flex-row items-center bg-whiteBlue pl-2 rounded-lg w-full h-12 text-lg">
            <SearchIcon color="gray" size={30} />
            <TextInput
              placeholder="Buscar..."
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
          ) : (
            <FlatList
              className="flex-1 w-full"
              data={filteredPatients}
              keyExtractor={(patient) => patient.Id.toString()}
              renderItem={({ item }) => (
                <PatientCard
                  patient={item}
                  openId={openId}
                  setOpenId={setOpenId}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ gap: 12, flexGrow: 1 }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center">
                  <SadIcon color="#9ca3af" size={100} />
                  <Text className="font-bold text-gray-400 text-xl italic">
                    No hay resultados para &quot;{searchValue}&quot;
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
