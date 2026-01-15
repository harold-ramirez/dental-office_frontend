import { TriangleDownIcon, TriangleUpIcon } from "@/components/Icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function MedicalHistory() {
  const { patientId, patientName } = useLocalSearchParams();
  const [selectedAppointment, setSelectedAppointment] = useState<{
    dateHour: string;
    minutesDuration: number;
    requestMessage: string | null;
    treatment: string | null;
  } | null>(null);
  const [isOpen, setIsOpen] = useState({
    last10: true,
    currentMonth: false,
    lastMonth: false,
    allAppointments: false,
  });
  const [appointmentHistory, setAppointmentHistory] = useState<{
    last10Appointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
    }[];
    currentMonthAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
    }[];
    lastMonthAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
    }[];
    allAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
    }[];
  }>({
    last10Appointments: [],
    currentMonthAppointments: [],
    lastMonthAppointments: [],
    allAppointments: [],
  });

  const fetchAppointmentsHistory = useCallback(async () => {
    try {
      const data = await fetch(
        `${apiUrl}/appointments/history/${patientId}`
      ).then((res) => res.json());
      setAppointmentHistory(data);
    } catch (e) {
      console.error("Error fetching appointments history:", e);
    }
  }, [patientId]);
  useEffect(() => {
    fetchAppointmentsHistory();
  }, [fetchAppointmentsHistory]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute bg-black/75 w-full h-full"
    >
      <LinearGradient
        colors={["#001B48", "#018ABE", "#001B48"]}
        className="top-0 right-0 left-0 absolute h-full"
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
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
            headerTitle: "Historial de Citas",
            headerRight: () => <></>,
          }}
        />
        <View className="bg-whiteBlue p-2 w-full h-full">
          <Text className="font-bold text-blackBlue text-2xl text-center">
            {patientName}
          </Text>

          <ScrollView
            className="flex-1 w-full"
            showsVerticalScrollIndicator={false}
          >
            {/* Last 10 Appointments */}
            <Pressable
              onPress={() => setIsOpen({ ...isOpen, last10: !isOpen.last10 })}
              className="flex-row justify-between items-center bg-blackBlue active:bg-darkBlue my-3 px-2 py-1 rounded-md"
            >
              <Text className="text-whiteBlue">Últimas 10 citas</Text>
              {isOpen.last10 ? (
                <TriangleUpIcon color={"#D6E8EE"} />
              ) : (
                <TriangleDownIcon color={"#D6E8EE"} />
              )}
            </Pressable>
            {isOpen.last10 &&
              (appointmentHistory.last10Appointments.length === 0 ? (
                <Text className="text-darkBlue text-center italic">
                  No hay registros de citas
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between gap-1 p-3 pt-0 border-blackBlue border-b">
                    <Text className="font-bold text-blackBlue text-lg text-left">
                      Fecha
                    </Text>
                    <Text className="font-bold text-blackBlue text-lg text-center">
                      Tratamiento
                    </Text>
                  </View>
                  <View className="gap-2">
                    {appointmentHistory.last10Appointments.map(
                      (appointment, i) => (
                        <AppointmentRecord
                          key={i}
                          appointment={appointment}
                          setSelectedAppointment={setSelectedAppointment}
                        />
                      )
                    )}
                  </View>
                </>
              ))}

            {/* Current Month Appointments */}
            <Pressable
              onPress={() =>
                setIsOpen({ ...isOpen, currentMonth: !isOpen.currentMonth })
              }
              className="flex-row justify-between items-center bg-blackBlue active:bg-darkBlue my-3 px-2 py-1 rounded-md"
            >
              <Text className="text-whiteBlue">Mes Actual</Text>
              {isOpen.currentMonth ? (
                <TriangleUpIcon color={"#D6E8EE"} />
              ) : (
                <TriangleDownIcon color={"#D6E8EE"} />
              )}
            </Pressable>
            {isOpen.currentMonth &&
              (appointmentHistory.currentMonthAppointments.length === 0 ? (
                <Text className="text-darkBlue text-center italic">
                  No hay registros de citas
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between gap-1 p-3 pt-0 border-blackBlue border-b">
                    <Text className="font-bold text-blackBlue text-lg text-left">
                      Fecha
                    </Text>
                    <Text className="font-bold text-blackBlue text-lg text-center">
                      Tratamiento
                    </Text>
                  </View>
                  <View className="gap-2">
                    {appointmentHistory.currentMonthAppointments.map(
                      (appointment, i) => (
                        <AppointmentRecord
                          key={i}
                          appointment={appointment}
                          setSelectedAppointment={setSelectedAppointment}
                        />
                      )
                    )}
                  </View>
                </>
              ))}

            {/* Last Month Appointments */}
            <Pressable
              onPress={() =>
                setIsOpen({ ...isOpen, lastMonth: !isOpen.lastMonth })
              }
              className="flex-row justify-between items-center bg-blackBlue active:bg-darkBlue my-3 px-2 py-1 rounded-md"
            >
              <Text className="text-whiteBlue">Mes Pasado</Text>
              {isOpen.lastMonth ? (
                <TriangleUpIcon color={"#D6E8EE"} />
              ) : (
                <TriangleDownIcon color={"#D6E8EE"} />
              )}
            </Pressable>
            {isOpen.lastMonth &&
              (appointmentHistory.lastMonthAppointments.length === 0 ? (
                <Text className="text-darkBlue text-center italic">
                  No hay registros de citas
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between gap-1 p-3 pt-0 border-blackBlue border-b">
                    <Text className="font-bold text-blackBlue text-lg text-left">
                      Fecha
                    </Text>
                    <Text className="font-bold text-blackBlue text-lg text-center">
                      Tratamiento
                    </Text>
                  </View>
                  <View className="gap-2">
                    {appointmentHistory.lastMonthAppointments.map(
                      (appointment, i) => (
                        <AppointmentRecord
                          key={i}
                          appointment={appointment}
                          setSelectedAppointment={setSelectedAppointment}
                        />
                      )
                    )}
                  </View>
                </>
              ))}

            {/* All Appointments */}
            <Pressable
              onPress={() =>
                setIsOpen({
                  ...isOpen,
                  allAppointments: !isOpen.allAppointments,
                })
              }
              className="flex-row justify-between items-center bg-blackBlue active:bg-darkBlue my-3 px-2 py-1 rounded-md"
            >
              <Text className="text-whiteBlue">Todas</Text>
              {isOpen.allAppointments ? (
                <TriangleUpIcon color={"#D6E8EE"} />
              ) : (
                <TriangleDownIcon color={"#D6E8EE"} />
              )}
            </Pressable>
            {isOpen.allAppointments &&
              (appointmentHistory.allAppointments.length === 0 ? (
                <Text className="text-darkBlue text-center italic">
                  No hay registros de citas
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between gap-1 p-3 pt-0 border-blackBlue border-b">
                    <Text className="font-bold text-blackBlue text-lg text-left">
                      Fecha
                    </Text>
                    <Text className="font-bold text-blackBlue text-lg text-center">
                      Tratamiento
                    </Text>
                  </View>
                  <View className="gap-2">
                    {appointmentHistory.allAppointments.map(
                      (appointment, i) => (
                        <AppointmentRecord
                          key={i}
                          appointment={appointment}
                          setSelectedAppointment={setSelectedAppointment}
                        />
                      )
                    )}
                  </View>
                </>
              ))}
          </ScrollView>

          {/* Details Box */}
          <View className="px-2 border-2 border-darkBlue rounded-md w-full min-h-28 max-h-64">
            <ScrollView
              className="gap-1 py-2"
              showsVerticalScrollIndicator={false}
            >
              {!selectedAppointment ? (
                <Text className="w-full text-blackBlue/75 text-center italic">
                  Seleccione una cita para ver los detalles
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between gap-1">
                    <Text className="font-bold text-blackBlue">Fecha:</Text>
                    <View className="flex-1 border-blackBlue border-b-2 border-dotted" />
                    <Text className="text-blackBlue text-right">
                      {new Date(
                        selectedAppointment.dateHour
                      ).toLocaleDateString("es-BO", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </Text>
                  </View>
                  <View className="flex-row justify-between gap-1">
                    <Text className="font-bold text-blackBlue">Duración:</Text>
                    <View className="flex-1 border-blackBlue border-b-2 border-dotted" />
                    <Text className="text-blackBlue text-right">
                      {(() => {
                        const totalMinutes =
                          selectedAppointment.minutesDuration;
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        if (hours > 0 && minutes > 0) {
                          return `${hours} ${
                            hours === 1 ? "hora" : "horas"
                          } ${minutes} min`;
                        } else if (hours > 0) {
                          return `${hours} ${hours === 1 ? "hora" : "horas"}`;
                        } else {
                          return `${minutes} min`;
                        }
                      })()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between gap-1">
                    <Text className="font-bold text-blackBlue">
                      Tratamiento:
                    </Text>
                    <View className="flex-1 border-blackBlue border-b-2 border-dotted" />
                    <Text
                      className={`text-blackBlue text-right ${
                        selectedAppointment.treatment ?? `italic`
                      }`}
                    >
                      {selectedAppointment.treatment ?? "No especificado"}
                    </Text>
                  </View>
                  <View
                    className={`gap-1 mb-5 ${
                      !selectedAppointment.requestMessage
                        ? `flex-row justify-between`
                        : ``
                    }`}
                  >
                    <Text className="font-bold text-blackBlue">
                      Mensaje de Solicitud:
                    </Text>
                    {!selectedAppointment.requestMessage && (
                      <View className="flex-1 border-blackBlue border-b-2 border-dotted" />
                    )}
                    <Text
                      className={`rounded-md  italic ${
                        selectedAppointment.requestMessage
                          ? `bg-darkBlue p-2 text-whiteBlue text-center`
                          : `text-blackBlue`
                      }`}
                    >
                      {selectedAppointment.requestMessage
                        ? `"${selectedAppointment.requestMessage}"`
                        : "No especificado"}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

interface AppointmentRecordProps {
  appointment: any;
  setSelectedAppointment: (ap: any) => void;
}
export function AppointmentRecord(props: AppointmentRecordProps) {
  const { appointment, setSelectedAppointment } = props;
  return (
    <Pressable
      onPress={() => setSelectedAppointment(appointment)}
      className="flex-row justify-between gap-1 active:bg-lightBlue/50 py-3 rounded-md"
    >
      <Text className="text-left">
        {new Date(appointment.dateHour).toLocaleDateString("es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
      </Text>
      <View className="flex-1 border-blackBlue border-b-2 border-dotted" />
      <Text className={`text-center ${appointment.treatment ?? `italic`}`}>
        {appointment.treatment ?? "Sin tratamiento"}
      </Text>
    </Pressable>
  );
}
