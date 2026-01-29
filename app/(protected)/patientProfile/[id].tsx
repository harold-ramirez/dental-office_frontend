import { DeleteAlertMessage } from "@/components/alertMessage";
import {
  CakeIcon,
  DocumentIcon,
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
import { MedicalImageDto, PatientDto } from "@/interfaces/interfaces";
import { authService } from "@/services/authService";
import { EventArg, NavigationAction } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Link,
  RelativePathString,
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PatientProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const isNavigatingBack = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [patient, setPatient] = useState<PatientDto>({
    Id: Number(id),
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "",
    telephoneNumber: "",
    cellphoneNumber: "",
    occupation: "",
    birthdate: "",
    placeOfBirth: "",
    address: "",
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

  const fetchPatient = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await authService.getToken();
      const endpoint = await fetch(`${API_URL}/patients/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await endpoint.json();
      setPatient(data);
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Refresh previous screen
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
          pathname: "/(protected)/(tabs)/patients",
          params: { refresh: Date.now().toString() },
        });
      },
    );
    return unsubscribe;
  }, [navigation, router, dataModified]);

  //sections api calls
  const [images, setImages] = useState<MedicalImageDto[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<
    { dateHour: string; treatment: string | null }[]
  >([]);
  const [medicalHistories, setMedicalHistories] = useState<
    { registerDate: string }[]
  >([]);
  const fetchAllPatientImages = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const endpoint = await fetch(`${API_URL}/images/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await endpoint.json();
      setImages(data);
    } catch (e) {
      console.error("Error fetching images:", e);
    }
  }, [id]);

  const fetchMedicalHistories = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const data = await fetch(`${API_URL}/medical-history/preview/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setMedicalHistories(data);
    } catch (e) {
      console.error("Error fetching medical histories:", e);
    }
  }, [id]);

  const fetchTreatments = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const data = await fetch(`${API_URL}/diagnosed-procedure/${id}/preview`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setTreatments(data);
    } catch (e) {
      console.error("Error fetching Treatments:", e);
    }
  }, [id]);

  const fetchAppointments = useCallback(async () => {
    try {
      const token = await authService.getToken();
      const data = await fetch(`${API_URL}/appointments/preview/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setAppointments(data);
    } catch (e) {
      console.error("Error fetching Appointments:", e);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatient();
    await fetchAllPatientImages();
    await fetchMedicalHistories();
    await fetchTreatments();
    await fetchAppointments();
    setRefreshing(false);
  }, [
    fetchPatient,
    fetchAllPatientImages,
    fetchMedicalHistories,
    fetchTreatments,
    fetchAppointments,
  ]);
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          className="w-full"
        >
          <View className="flex-1 bg-lightBlue p-3 rounded-2xl w-full">
            <View className="flex-row gap-3 mb-5">
              <View className="items-center gap-2">
                {/* Profile Photo */}
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

                {/* Edit Info */}
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
                {/* Patient's Name */}
                <Text className="font-extrabold text-blackBlue text-3xl">
                  {[
                    patient?.name,
                    patient?.paternalSurname,
                    patient?.maternalSurname,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </Text>
                {/* PhoneNumber */}
                {patient?.cellphoneNumber && (
                  <View className="flex-row items-center gap-2">
                    <PhoneIcon size={21} color="#02457A" />
                    <Text className={`text-blackBlue text-lg`}>
                      {patient.cellphoneNumber}
                      {patient?.telephoneNumber &&
                        ` - ${patient.telephoneNumber}`}
                    </Text>
                  </View>
                )}
                {/* Gender */}
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
                {/* Occupation */}
                {patient?.occupation && (
                  <View className="flex-row items-center gap-2">
                    <JobIcon size={18} color="#02457A" />
                    <Text className="text-blackBlue">{patient.occupation}</Text>
                  </View>
                )}
                {/* Age */}
                <View className="flex-row items-center gap-2">
                  <CakeIcon size={18} color="#02457A" />
                  <Text className="text-blackBlue">
                    {new Date(patient.birthdate).toLocaleDateString("es-BO")}
                    {" - "}
                    {age} años
                  </Text>
                </View>
                {/* Place of birth */}
                {patient?.placeOfBirth && (
                  <View className="flex-row items-center gap-2 pl-1">
                    <MapMarkerIcon size={18} color="#02457A" />
                    <Text className="text-blackBlue">
                      {patient.placeOfBirth}
                    </Text>
                  </View>
                )}
                {/* Address */}
                {patient?.address && (
                  <View className="flex-row gap-2">
                    <HouseIcon size={16} color="#02457A" />
                    <Text className="text-blackBlue">{patient.address}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Medical History Form */}
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
            <View className="flex-row justify-center items-center gap-2 bg-whiteBlue mb-3 rounded-md w-full h-32">
              {medicalHistories.slice(0, 3).map((history, i) => {
                if (i === 2 && medicalHistories.length > 2) {
                  return (
                    <Link
                      key={i}
                      href={{
                        pathname: "/medicalHistory/[patientId]",
                        params: { patientId: id.toString() },
                      }}
                    >
                      <View className="w-[100px] h-[100px]">
                        <View className="justify-center items-center p-1 border border-blackBlue rounded-md w-[100px] h-[100px]">
                          <DocumentIcon color="#001B48" size={32} />
                          <Text className="text-blackBlue">
                            {new Date(history.registerDate).toLocaleDateString(
                              "es-BO",
                            )}
                          </Text>
                        </View>
                        <View className="absolute justify-center items-center bg-blackBlue/75 w-[100px] h-[100px]">
                          <Text className="font-semibold text-whiteBlue text-3xl">
                            +{medicalHistories.length - 2}
                          </Text>
                        </View>
                      </View>
                    </Link>
                  );
                }
                return (
                  <View
                    key={i}
                    className="justify-center items-center p-1 border border-blackBlue rounded-md w-[100px] h-[100px]"
                  >
                    <DocumentIcon color="#001B48" size={32} />
                    <Text className="text-blackBlue">
                      {new Date(history.registerDate).toLocaleDateString(
                        "es-BO",
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Odontogram */}
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

            {/* Treatments */}
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
            <View className="bg-whiteBlue mb-3 p-3 rounded-md w-full h-32 overflow-hidden">
              {treatments.length === 0 ? (
                <Text className="w-full text-blackBlue text-center italic">
                  No se tiene registrado ningún tratamiento realizado a este
                  paciente
                </Text>
              ) : (
                treatments.map((treatment) => (
                  <View key={treatment.Id} className="flex-row">
                    <Text className="text-blackBlue">
                      {treatment.treatment.name}
                    </Text>
                    <View className="flex-1 mx-2 mb-1 border-blackBlue border-b border-dotted" />
                    <Text className="text-blackBlue">
                      {new Date(treatment.registerDate).toLocaleDateString(
                        "es-BO",
                      )}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* Appointments History */}
            <Link
              href={{
                pathname: "/(protected)/appointmentHistory/[patientId]",
                params: {
                  patientId: id.toString(),
                  patientName: [
                    patient?.name,
                    patient?.paternalSurname,
                    patient?.maternalSurname,
                  ]
                    .filter(Boolean)
                    .join(" "),
                },
              }}
              className="active:bg-blackBlue/30 py-1 rounded-md"
            >
              <View className="flex-row justify-center items-center">
                <Text className="flex-1 font-extrabold text-blackBlue text-lg">
                  HISTORIAL DE CITAS
                </Text>
                <RightArrowIcon color="#001B48" />
              </View>
            </Link>
            <View className="bg-whiteBlue mb-3 px-3 pt-1 rounded-md w-full h-32 overflow-hidden">
              {appointments.length === 0 ? (
                <Text className="w-full text-blackBlue text-center italic">
                  No se tiene registrado ninguna cita de este paciente
                </Text>
              ) : (
                appointments.map((appointment, i) => (
                  <View key={i} className="flex-row justify-between gap-1">
                    <Text className="text-blackBlue text-left">
                      {new Date(appointment.dateHour).toLocaleDateString(
                        "es-BO",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        },
                      )}
                    </Text>
                    <View className="flex-1 border-blackBlue border-b border-dotted" />
                    <Text
                      className={`text-center text-blackBlue ${
                        appointment.treatment ?? `italic`
                      }`}
                    >
                      {appointment.treatment ?? "Sin tratamiento"}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* Medical Images */}
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
            <View className="flex-row justify-center items-center gap-2 bg-whiteBlue mb-3 rounded-md w-full h-32">
              {images.slice(0, 3).map((img, i) => {
                if (i === 2 && images.length > 2) {
                  return (
                    <Link
                      key={img.Id}
                      href={{
                        pathname: "/medicalImages/[patientId]",
                        params: { patientId: id.toString() },
                      }}
                    >
                      <View className="w-[100px] h-[100px]">
                        <Image
                          source={{ uri: `${API_URL}/uploads/${img.filename}` }}
                          width={100}
                          height={100}
                        />
                        <View className="absolute justify-center items-center bg-blackBlue/75 w-[100px] h-[100px]">
                          <Text className="font-semibold text-whiteBlue text-3xl">
                            +{images.length - 2}
                          </Text>
                        </View>
                      </View>
                    </Link>
                  );
                }
                return (
                  <Image
                    source={{ uri: `${API_URL}/uploads/${img.filename}` }}
                    key={i}
                    width={100}
                    height={100}
                  />
                );
              })}
            </View>

            {/* Delete Button */}
            <Pressable
              onPress={() => {
                DeleteAlertMessage(
                  "Confirmar Eliminación",
                  `¿Está seguro de eliminar al paciente "${[
                    patient?.name,
                    patient?.paternalSurname,
                    patient?.maternalSurname,
                  ]
                    .filter(Boolean)
                    .join(" ")}"?`,
                  "Eliminar",
                  `/patients/${id}`,
                  "No se pudo eliminar el paciente. Inténtalo de nuevo.",
                  "DELETE",
                  "/(tabs)/patients" as RelativePathString,
                );
              }}
              className="justify-center items-center bg-red-600 active:bg-red-800 mt-16 mb-5 p-2 rounded-full w-full"
            >
              <Text className="font-semibold text-whiteBlue">
                Eliminar Paciente
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Loader */}
        {isLoading && (
          <View className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center gap-2 bg-blackBlue/25">
            <View className="justify-center items-center gap-2 bg-blackBlue/75 rounded-xl size-28">
              <ActivityIndicator color={"#D6E8EE"} size={50} />
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Update Modal */}
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
