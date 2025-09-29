import { WeekAppointmentSelect } from "@/components/appointments-requests/scheduleModes";
import DropdownComponent from "@/components/dropdown";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
const patientsList = [
  { label: "Juanito", value: "1" },
  { label: "Alberto", value: "2" },
  { label: "Ana", value: "3" },
  { label: "Carlos", value: "4" },
  { label: "Claudia", value: "5" },
  { label: "Harold", value: "6" },
];
const treatmentsList = [
  { label: "Ortodoncia", value: "1" },
  { label: "Blanqueamiento", value: "2" },
  { label: "Caries", value: "3" },
  { label: "Tratamiento de Conducto", value: "4" },
];

export default function DayScheduleDetails() {
  const { selectedDate, patient } = useLocalSearchParams<{
    selectedDate?: string;
    patient?: string;
  }>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointment, setAppoinment] = useState({
    dateHour: new Date(),
    AppointmentRequest_Id: null,
    DiagnosedProcedure_Id: null,
    Patient_Id: null,
    minutesDuration: null,
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
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Paciente:
            </Text>
            <DropdownComponent className="w-1/2" data={patientsList} />
          </View>
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Tratamiento:
            </Text>
            <DropdownComponent className="w-1/2" data={treatmentsList} />
          </View>

          <View className="flex-row justify-evenly items-center w-full">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Fecha/Hora{`\n`}Cita Médica:
            </Text>
            <DatePicker
              modal
              mode="datetime"
              open={showDatePicker}
              date={appointment.dateHour}
              onConfirm={(date) => {
                setAppoinment({ ...appointment, dateHour: date });
                setShowDatePicker(false);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="w-1/2 bg-whiteBlue p-2 rounded-md"
            >
              <Text className="text-center text-lg capitalize text-blackBlue">
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

          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Duración:
            </Text>
            <DropdownComponent
              className="w-1/2"
              data={[
                { label: "30 min", value: "30" },
                { label: "1 hora", value: "60" },
                { label: "1 hora y media", value: "90" },
                { label: "2 horas", value: "120" },
                { label: "2 horas y media", value: "150" },
                { label: "3 horas", value: "180" },
              ]}
            />
          </View>
          <WeekAppointmentSelect />
        </View>

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
    </>
  );
}
