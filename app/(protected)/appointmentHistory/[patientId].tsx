import { TriangleDownIcon, TriangleUpIcon } from "@/components/Icons";
import PopupModal from "@/components/popupModal";
import { fetchWithToken } from "@/services/fetchData";
import { FormatDuration } from "@/services/formatAppointmentDuration";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppointmentHistory() {
  const { logOut } = useContext(AuthContext);
  const { patientId, patientName } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    dateHour: string;
    minutesDuration: number;
    requestMessage: string | null;
    treatment: string | null;
    notes: string | null;
  }>({
    dateHour: "",
    minutesDuration: 15,
    requestMessage: null,
    treatment: null,
    notes: null,
  });
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
      notes: null;
    }[];
    currentMonthAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
      notes: null;
    }[];
    lastMonthAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
      notes: null;
    }[];
    allAppointments: {
      dateHour: string;
      minutesDuration: number;
      requestMessage: string | null;
      treatment: string | null;
      notes: null;
    }[];
  }>({
    last10Appointments: [],
    currentMonthAppointments: [],
    lastMonthAppointments: [],
    allAppointments: [],
  });

  const fetchAppointmentsHistory = useCallback(async () => {
    try {
      const data = await fetchWithToken(
        `/appointments/history/${patientId}`,
        { method: "GET" },
        logOut,
      );
      setAppointmentHistory(data);
    } catch {}
  }, [patientId, logOut]);

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
                  <FlatList
                    data={appointmentHistory.last10Appointments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <AppointmentRecord
                        appointment={item}
                        onPress={() => {
                          setSelectedAppointment(item);
                          setModalVisible(true);
                        }}
                      />
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 8 }}
                  />
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
                  <FlatList
                    data={appointmentHistory.currentMonthAppointments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <AppointmentRecord
                        appointment={item}
                        onPress={() => {
                          setSelectedAppointment(item);
                          setModalVisible(true);
                        }}
                      />
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 8 }}
                  />
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
                  <FlatList
                    data={appointmentHistory.lastMonthAppointments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <AppointmentRecord
                        appointment={item}
                        onPress={() => {
                          setSelectedAppointment(item);
                          setModalVisible(true);
                        }}
                      />
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 8 }}
                  />
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
                  <FlatList
                    data={appointmentHistory.allAppointments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <AppointmentRecord
                        appointment={item}
                        onPress={() => {
                          setSelectedAppointment(item);
                          setModalVisible(true);
                        }}
                      />
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 8 }}
                  />
                </>
              ))}
          </ScrollView>

          {/* Details Modal */}
          <PopupModal
            showModal={modalVisible}
            setShowModal={setModalVisible}
            customDesign
          >
            <View className="flex-1 w-full items-center">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 w-full"
              />
              <View className="bg-pureBlue px-4 py-4 rounded-t-2xl w-full">
                {/* Date */}
                <View className="flex-row justify-between gap-1">
                  <Text className="font-bold text-whiteBlue">Fecha:</Text>
                  <View className="flex-1 border-whiteBlue border-b border-dotted" />
                  <Text className="text-whiteBlue">
                    {new Date(selectedAppointment.dateHour).toLocaleDateString(
                      "es-BO",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </Text>
                </View>
                {/* Duration */}
                <View className="flex-row justify-between gap-1">
                  <Text className="font-bold text-whiteBlue">Duración:</Text>
                  <View className="flex-1 border-whiteBlue border-b border-dotted" />
                  <Text className="text-whiteBlue">
                    {(() => {
                      const starAppt = new Date(selectedAppointment.dateHour);
                      const endAppt = new Date(selectedAppointment.dateHour);
                      endAppt.setMinutes(
                        endAppt.getMinutes() +
                          selectedAppointment.minutesDuration,
                      );
                      const formated: string =
                        starAppt
                          .toLocaleDateString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .split(", ")[1] +
                        " - " +
                        endAppt
                          .toLocaleDateString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .split(", ")[1] +
                        "  (" +
                        FormatDuration(selectedAppointment.minutesDuration) +
                        ")";
                      return formated;
                    })()}
                  </Text>
                </View>
                {/* Treatment */}
                <View className="flex-row justify-between gap-1">
                  <Text className="font-bold text-whiteBlue">Tratamiento:</Text>
                  <View className="flex-1 border-whiteBlue border-b border-dotted" />
                  <Text
                    className={`text-whiteBlue text-right ${
                      selectedAppointment.treatment ?? `italic`
                    }`}
                  >
                    {selectedAppointment.treatment ?? "N/A"}
                  </Text>
                </View>
                {/* Notes */}
                <View
                  className={`gap-1 ${
                    !selectedAppointment.notes
                      ? `flex-row justify-between`
                      : `mb-2`
                  }`}
                >
                  <Text className="font-bold text-whiteBlue">Notas:</Text>
                  {!selectedAppointment.notes && (
                    <View className="flex-1 border-whiteBlue border-b border-dotted" />
                  )}
                  <Text
                    className={`rounded-md text-whiteBlue ${
                      selectedAppointment.notes
                        ? `text-center py-1 bg-pureBlue font-semibold`
                        : `italic`
                    }`}
                  >
                    {selectedAppointment.notes ?? "N/A"}
                  </Text>
                </View>
                {/* Request Message */}
                <View
                  className={`gap-1 mb-5 ${
                    !selectedAppointment.requestMessage
                      ? `flex-row justify-between`
                      : ``
                  }`}
                >
                  <Text className="font-bold text-whiteBlue">
                    Mensaje de Solicitud:
                  </Text>
                  {!selectedAppointment.requestMessage && (
                    <View className="flex-1 border-whiteBlue border-b border-dotted" />
                  )}
                  <Text
                    className={`rounded-md italic ${
                      selectedAppointment.requestMessage
                        ? `bg-darkBlue p-2 text-whiteBlue text-center`
                        : `text-whiteBlue`
                    }`}
                  >
                    {selectedAppointment.requestMessage
                      ? `"${selectedAppointment.requestMessage}"`
                      : "N/A"}
                  </Text>
                </View>
                <View className="h-16" />
              </View>
            </View>
          </PopupModal>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

interface AppointmentRecordProps {
  appointment: {
    dateHour: string;
    treatment: string | null;
  };
  onPress: () => void;
}
export function AppointmentRecord(props: AppointmentRecordProps) {
  const { appointment, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
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
