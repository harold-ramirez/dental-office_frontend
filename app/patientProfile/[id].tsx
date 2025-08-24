import {
  CakeIcon,
  EditIcon,
  FemaleIcon,
  HouseIcon,
  JobIcon,
  MaleIcon,
  MapMarkerIcon,
  PhoneIcon,
  ProfileIconAlt,
  RightArrowIcon,
} from "@/components/Icons";
import { UpdatePatientModal } from "@/components/patients/patientModal";
import { PatientDto } from "@/interfaces/interfaces";
import { EventArg, NavigationAction } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Link,
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientProfile() {
  const router = useRouter();
  const navigation = useNavigation();
  const isNavigatingBack = useRef(false);
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<PatientDto>({
    Id: Number(id),
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "",
    phoneNumber: "",
    occupation: "",
    birthdate: "",
    placeOfBirth: "",
    address: "",
    AppUser_Id: 1,
  });
  const [showUpdatePatient, setShowUpdatePatient] = useState(false);
  const [dataModified, setDataModified] = useState(false);
  let age: number = 0;
  if (patient?.birthdate) {
    const birth = new Date(patient?.birthdate);
    const today = new Date();
    age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  }
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchPatient = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = await fetch(`${apiUrl}/patients/${id}`);
      const data = await endpoint.json();
      setPatient(data);
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, id]);

  const deletePatient = useCallback(() => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Está seguro de eliminar al paciente "${[
        patient?.name,
        patient?.paternalSurname,
        patient?.maternalSurname,
      ]
        .filter(Boolean)
        .join(" ")}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            setIsLoading(true);
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            try {
              const endpoint = await fetch(`${apiUrl}/patients/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (endpoint.ok) {
                router.replace({
                  pathname: "/(tabs)/patients",
                  params: { refresh: Date.now().toString() },
                });
              } else {
                Alert.alert(
                  "Error",
                  "No se pudo eliminar el paciente. Inténtalo de nuevo.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("Error al eliminar el paciente:", error);
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  }, [id, patient, router]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e: EventArg<"beforeRemove", true, { action: NavigationAction }>) => {
        if (isNavigatingBack.current) {
          return;
        }
        if (!dataModified) {
          return;
        }
        e.preventDefault();
        isNavigatingBack.current = true;
        router.replace({
          pathname: "/(tabs)/patients",
          params: { refresh: Date.now().toString() },
        });
      }
    );

    return unsubscribe;
  }, [navigation, router, dataModified]);

  return (
    <>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 12,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "PERFIL DEL PACIENTE",
            headerRight: () => <></>,
          }}
        />
        <LinearGradient
          colors={["#02457A", "#018ABE", "#02457A"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="top-0 right-0 bottom-0 left-0 absolute"
        />
        <ScrollView className="w-full">
          <View className="flex-1 bg-lightBlue p-3 border-4 border-blackBlue rounded-2xl w-full">
            <View className="flex-row gap-3">
              <View className="items-center gap-2">
                <View
                  className={`rounded-full size-24 border items-center justify-center ${
                    patient?.gender === "M"
                      ? `bg-blue-300 border-blackBlue`
                      : `bg-pink-300 border-whiteBlue`
                  }`}
                >
                  <ProfileIconAlt
                    size={age <= 15 ? 30 : 50}
                    color={patient?.gender === "M" ? "black" : "white"}
                  />
                </View>
                <Pressable
                  onPress={() => setShowUpdatePatient(true)}
                  className="flex-row justify-center items-center gap-1 bg-blackBlue active:bg-darkBlue p-1 rounded-md w-24"
                >
                  <EditIcon color="#D6E8EE" size={16} />
                  <Text className="font-semibold text-whiteBlue text-sm">
                    Editar
                  </Text>
                </Pressable>
              </View>
              <View className="flex-col flex-1">
                <Text className="font-extrabold text-blackBlue text-3xl">
                  {[
                    patient?.name,
                    patient?.paternalSurname,
                    patient?.maternalSurname,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </Text>
                {patient?.phoneNumber && (
                  <View className="flex-row items-center gap-2">
                    <PhoneIcon size={21} color="#02457A" />
                    <Text className={`text-blackBlue text-lg`}>
                      {patient.phoneNumber}
                    </Text>
                  </View>
                )}
                {patient.gender === "M" ? (
                  <View className="flex-row items-center gap-2">
                    <View className="bg-darkBlue rounded-md">
                      <MaleIcon size={18} color="#97CADB" />
                    </View>
                    <Text className="text-blackBlue">Masculino</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <View className="bg-darkBlue rounded-md">
                      <FemaleIcon size={18} color="#97CADB" />
                    </View>
                    <Text className="text-blackBlue">Femenino</Text>
                  </View>
                )}
                {patient?.occupation && (
                  <View className="flex-row items-center gap-2">
                    <JobIcon size={18} color="#02457A" />
                    <Text className="text-blackBlue">{patient.occupation}</Text>
                  </View>
                )}
                <View className="flex-row items-center gap-2">
                  <CakeIcon size={18} color="#02457A" />
                  <Text className="text-blackBlue">
                    {new Date(patient.birthdate).toLocaleDateString("es-ES")}
                    {" - "}
                    {age} años
                  </Text>
                </View>
                {patient?.placeOfBirth && (
                  <View className="flex-row items-center gap-2 pl-1">
                    <MapMarkerIcon size={18} color="#02457A" />
                    <Text className="text-blackBlue">
                      {patient.placeOfBirth}
                    </Text>
                  </View>
                )}
                {patient?.address && (
                  <View className="flex-row gap-2">
                    <HouseIcon size={16} color="#02457A" />
                    <Text className="text-blackBlue">{patient.address}</Text>
                  </View>
                )}
              </View>
            </View>
            <View className="mb-5"></View>

            <Link
              href={{
                pathname: "/medicalHistory/[patientId]",
                params: { patientId: id.toString() },
              }}
              className="active:bg-blackBlue/30 py-1 rounded-md"
            >
              <View className="flex-row justify-center items-center">
                <Text className="flex-1 font-extrabold text-blackBlue text-lg">
                  FORMULARIO HISTORIA CLÍNICA
                </Text>
                <RightArrowIcon color="#001B48" />
              </View>
            </Link>
            <View className="bg-whiteBlue mb-3 rounded-md w-full h-32"></View>

            <Link
              href={{
                pathname: "/odontogram/[patientId]",
                params: { patientId: id.toString() },
              }}
              className="active:bg-blackBlue/30 py-1 rounded-md"
            >
              <View className="flex-row justify-center items-center">
                <Text className="flex-1 font-extrabold text-blackBlue text-lg">
                  ODONTOGRAMA
                </Text>
                <RightArrowIcon color="#001B48" />
              </View>
            </Link>
            <View className="bg-whiteBlue mb-3 rounded-md w-full h-32"></View>

            <Link
              href={{
                pathname: "/patientTreatments/[patientId]",
                params: { patientId: id.toString() },
              }}
              className="active:bg-blackBlue/30 py-1 rounded-md"
            >
              <View className="flex-row justify-center items-center">
                <Text className="flex-1 font-extrabold text-blackBlue text-lg">
                  TRATAMIENTOS REALIZADOS
                </Text>
                <RightArrowIcon color="#001B48" />
              </View>
            </Link>
            <View className="bg-whiteBlue mb-3 rounded-md w-full h-32"></View>

            <Link
              href={{
                pathname: "/medicalImages/[patientId]",
                params: { patientId: id.toString() },
              }}
              className="active:bg-blackBlue/30 py-1 rounded-md"
            >
              <View className="flex-row justify-center items-center">
                <Text className="flex-1 font-extrabold text-blackBlue text-lg">
                  IMÁGENES COMPLEMENTARIAS
                </Text>
                <RightArrowIcon color="#001B48" />
              </View>
            </Link>
            <View className="bg-whiteBlue mb-3 rounded-md w-full h-32"></View>

            <Pressable
              onPress={deletePatient}
              className="justify-center items-center bg-red-600 active:bg-red-800 mt-16 mb-5 p-2 rounded-full w-full"
            >
              <Text className="font-semibold text-whiteBlue">
                Eliminar Paciente
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        {isLoading && (
          <View className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center gap-2 bg-blackBlue/25">
            <View className="justify-center items-center gap-2 bg-blackBlue/75 rounded-xl size-28">
              <ActivityIndicator color={"#D6E8EE"} size={50} />
            </View>
          </View>
        )}
      </SafeAreaView>
      {showUpdatePatient && (
        <UpdatePatientModal
          onClose={(updated) => {
            setShowUpdatePatient(false);
            if (updated) {
              setDataModified(true);
              fetchPatient();
            }
          }}
          patient={patient}
        />
      )}
    </>
  );
}
