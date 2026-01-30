import { WeekAppointmentSelect } from "@/components/appointments-requests/scheduleModes";
import DropdownComponent from "@/components/dropdown";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DayScheduleDetails() {
  const { logOut } = useContext(AuthContext);
  const {
    selectedDate,
    patientID,
    duration = "15",
    notes,
    treatment,
    requestID,
    requestDate,
  } = useLocalSearchParams<{
    selectedDate: string;
    patientID?: string;
    duration?: string;
    notes?: string;
    treatment?: string;
    requestID?: string;
    requestDate?: string;
  }>();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);
  const [patientsList, setPatientsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [treatmentsList, setTreatmentsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppoinment] = useState({
    dateHour: new Date(selectedDate),
    AppointmentRequest_Id: null,
    Treatment_Id: Number(treatment) ?? 0,
    Patient_Id: Number(patientID) ?? 0,
    minutesDuration: Number(duration),
    notes: notes ?? "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsData, treatmentsData] = await Promise.all([
          fetchWithToken("/patients/names", { method: "GET" }, logOut),
          fetchWithToken("/treatments", { method: "GET" }, logOut),
        ]);

        const patients = patientsData.map(
          (item: { id: number; fullName: string }) => ({
            label: item.fullName,
            value: item.id.toString(),
          }),
        );

        const treatments = treatmentsData.map(
          (item: { Id: number; name: string }) => ({
            label: item.name,
            value: item.Id.toString(),
          }),
        );

        setPatientsList(patients);
        setTreatmentsList(treatments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logOut]);

  if (loading) {
    return (
      <>
        <LinearGradient
          colors={["#018ABE", "#02457A", "#018ABE"]}
          className="top-0 right-0 left-0 absolute h-full"
        />
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#D6E8EE" />
          <Text className="text-whiteBlue mt-4">Cargando datos...</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <LinearGradient
        colors={["#018ABE", "#02457A", "#018ABE"]}
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
            headerTitle: "Agendar Cita",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 gap-2 w-full">
          {/* Patient */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Paciente:
            </Text>
            <DropdownComponent
              className="flex-1"
              data={patientsList}
              value={appointment.Patient_Id.toString()}
              setValue={(val) => {
                setAppoinment({ ...appointment, Patient_Id: +val });
              }}
            />
          </View>
          {/* Treatment */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Tratamiento:
            </Text>
            <DropdownComponent
              className="flex-1"
              data={treatmentsList}
              value={appointment.Treatment_Id.toString()}
              setValue={(val) => {
                setAppoinment({
                  ...appointment,
                  Treatment_Id: +val,
                });
              }}
            />
          </View>

          {/* Date Hour */}
          <View className="flex-row justify-evenly items-center w-full">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Fecha/Hora{`\n`}Cita Médica:
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="flex-1 bg-whiteBlue p-2 rounded-md"
            >
              <Text className="text-blackBlue text-lg text-center capitalize">
                {appointment.dateHour.toLocaleString("es-BO", {
                  weekday: "long",
                  day: "numeric",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </Pressable>
          </View>

          {/* Duration */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Duración Estimada:
            </Text>
            <DropdownComponent
              className="flex-1"
              search={false}
              data={[
                { label: "15 min", value: "15" },
                { label: "30 min", value: "30" },
                { label: "45 min", value: "45" },
                { label: "1 hora", value: "60" },
                { label: "1 hora 15 min", value: "75" },
                { label: "1 hora 30 min", value: "90" },
                { label: "1 hora 45 min", value: "105" },
                { label: "2 horas", value: "120" },
                { label: "2 horas 15 min", value: "135" },
                { label: "2 horas 30 min", value: "150" },
                { label: "2 horas 45 min", value: "165" },
                { label: "3 horas", value: "180" },
              ]}
              value={appointment.minutesDuration.toString()}
              setValue={(val) => {
                setAppoinment({ ...appointment, minutesDuration: +val });
              }}
            />
          </View>

          {/* Notes */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Notas:
            </Text>
            <TextInput
              className="flex-1 bg-whiteBlue p-2 rounded-md text-blackBlue text-center"
              placeholder="Notas / Descripción de la cita"
              placeholderTextColor={"gray"}
              value={appointment.notes}
              onChangeText={(val) => {
                setAppoinment({ ...appointment, notes: val });
              }}
            />
          </View>
          {/* Request */}
          {requestID && (
            <View className="flex-row items-center">
              <Text className="font-bold w-1/3 text-whiteBlue text-lg text-center">
                Solicitado el:
              </Text>
              <View className="flex-1 items-center">
                <Text className="bg-blackBlue border border-whiteBlue text-whiteBlue rounded-full px-5 py-1">
                  {requestDate}
                </Text>
              </View>
            </View>
          )}
          {/* Weekly Schedule */}
          <View className="flex-1 justify-center items-center rounded-lg w-full">
            {!showWeeklySchedule ? (
              <Pressable
                onPress={() => setShowWeeklySchedule(true)}
                className="justify-center items-center active:bg-pureBlue px-5 py-2 border border-whiteBlue rounded-lg"
              >
                <Text className="font-medium text-whiteBlue text-lg">
                  Mostrar Agenda semanal
                </Text>
              </Pressable>
            ) : (
              <WeekAppointmentSelect
                setSelectesDate={(val) => {
                  setAppoinment({ ...appointment, dateHour: val });
                }}
              />
            )}
          </View>
        </View>

        {/* Buttons */}
        {patientID ? (
          <View className="flex-row gap-5">
            <Pressable className="flex-1 items-center bg-red-600 active:bg-red-800 my-2 py-2 border border-whiteBlue rounded-full">
              <Text className="font-semibold text-whiteBlue text-lg">
                Cancelar Cita
              </Text>
            </Pressable>
            <Pressable className="flex-1 items-center bg-whiteBlue active:bg-lightBlue my-2 py-2 border border-blackBlue rounded-full">
              <Text className="font-semibold text-blackBlue text-lg">
                Actualizar
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable className="items-center bg-darkBlue active:bg-pureBlue my-2 py-2 border border-whiteBlue rounded-full w-3/4">
            <Text className="font-semibold text-whiteBlue text-lg">
              Agendar
            </Text>
          </Pressable>
        )}
      </SafeAreaView>

      <DatePicker
        modal
        mode="datetime"
        minuteInterval={30}
        open={showDatePicker}
        date={appointment.dateHour}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setAppoinment({ ...appointment, dateHour: date });
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </>
  );
}
