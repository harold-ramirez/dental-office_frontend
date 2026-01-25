import { WeekAppointmentSelect } from "@/components/appointments-requests/scheduleModes";
import DropdownComponent from "@/components/dropdown";
import { fetchData } from "@/services/fetchData";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
// ------------------------------------------------------------------
const patientsApiData = fetchData("/patients/names");
const treatmentsApiData = fetchData("/treatments");
// ------------------------------------------------------------------

export default function DayScheduleDetails() {
  const { selectedDate, patient } = useLocalSearchParams<{
    selectedDate?: string;
    patient?: string;
  }>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);
  const [appointment, setAppoinment] = useState({
    dateHour: new Date(),
    AppointmentRequest_Id: null,
    Treatment_Id: 0,
    Patient_Id: 0,
    minutesDuration: 0,
    AppUser_Id: 1, //Hardcoded
  });
  const date = selectedDate ? new Date(selectedDate) : null;
  const isValidDate = date && !isNaN(date.getTime());
  const dateTextInput = isValidDate
    ? `${date.toLocaleDateString("es-BO", {
        weekday: "short",
        day: "numeric",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`
    : "...";

  // ------------------------------------------------------------------
  const patientsList: { label: string; value: string }[] = [];
  const treatmentsList: { label: string; value: string }[] = [];
  patientsApiData.read().map((item: { id: number; fullName: string }) => {
    patientsList.push({
      label: item.fullName,
      value: item.id.toString(),
    });
  });
  treatmentsApiData.read().map((item: { Id: number; name: string }) => {
    treatmentsList.push({
      label: item.name,
      value: item.Id.toString(),
    });
  });
  // ------------------------------------------------------------------

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
            <Suspense fallback={<View>no</View>}>
              <DropdownComponent
                className="flex-1"
                data={patientsList}
                value={appointment.Patient_Id.toString()}
                setValue={(val) => {
                  setAppoinment({ ...appointment, Patient_Id: +val });
                }}
              />
            </Suspense>
          </View>
          {/* Treatment */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Tratamiento:
            </Text>
            <Suspense fallback={<View>no</View>}>
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
            </Suspense>
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
            />
          </View>
          {/* Weekly Schedule */}
          <View className="flex-1 justify-center items-center bg-whiteBlue/20 rounded-lg w-full">
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
              <WeekAppointmentSelect />
            )}
          </View>
        </View>
        
        {/* Buttons */}
        {patient ? (
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
