import { WeekAppointmentSelect } from "@/components/appointments-requests/scheduleModes";
import DropdownComponent from "@/components/dropdown";
import { fetchWithToken, getApiErrorMessage } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { validateDate } from "@/utils/formValidators";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

export default function DayScheduleDetails() {
  const toast = useToast();
  const { logOut } = useContext(AuthContext);
  const {
    appointmentID,
    selectedDate,
    patientID,
    duration = "15",
    notes,
    treatment,
    requestID,
    requestName,
    requestPhoneNumber: requestPhoneNumberParam,
    sentRequestDate,
  } = useLocalSearchParams<{
    appointmentID?: string;
    selectedDate: string;
    patientID?: string;
    duration?: string;
    notes?: string;
    treatment?: string;
    requestID?: string;
    requestName?: string;
    requestPhoneNumber?: string;
    sentRequestDate?: string;
  }>();
  const router = useRouter();
  const [isRequestPatientRegistered, setIsRequestPatientRegistered] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);
  const [patientsList, setPatientsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [treatmentsList, setTreatmentsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [requestPhoneNumber, setRequestPhoneNumber] = useState<string | null>(
    requestPhoneNumberParam ?? null,
  );
  const [patientPhoneNumber, setPatientPhoneNumber] = useState<string | null>(
    null,
  );
  const [appointment, setAppoinment] = useState({
    Patient_Id: patientID ? Number(patientID) : 0,
    Treatment_Id: treatment ? Number(treatment) : 0,
    dateHour: new Date(selectedDate),
    minutesDuration: Number(duration),
    AppointmentRequest_Id: requestID ? Number(requestID) : null,
    notes: notes ?? "",
  });
  const originalAppointment = {
    dateHour: new Date(selectedDate),
    AppointmentRequest_Id: null,
    Treatment_Id: Number(treatment) ?? 0,
    Patient_Id: Number(patientID) ?? 0,
    minutesDuration: Number(duration),
    notes: notes ?? "",
  };

  const handlePostAppointment = async () => {
    if (!requestID && appointment.Patient_Id === 0) {
      toast.show("Por favor, seleccione un paciente", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    if (appointment.dateHour === null) {
      toast.show("Por favor, seleccione una fecha para la cita", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    // Validar que la fecha sea válida y no sea en el pasado
    if (!validateDate(appointment.dateHour.toISOString())) {
      toast.show("La fecha de la cita no es válida", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    const now = new Date();
    // Permitir citas del mismo día, solo rechazar si es en el pasado
    if (appointment.dateHour < now) {
      toast.show("La fecha de la cita no puede ser en el pasado", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    Alert.alert(
      "Confirmar Cita",
      `Se registrará una cita a nombre de ${
        patientsList.find(
          (patient) => patient.value === appointment.Patient_Id.toString(),
        )?.label ?? requestName
      } para el día ${appointment.dateHour.toLocaleDateString("es-BO", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Registrar Cita",
          onPress: async () => {
            try {
              setLoading(true);
              await fetchWithToken(
                "/appointments",
                {
                  method: "POST",
                  body: JSON.stringify({
                    ...appointment,
                    Treatment_Id:
                      appointment.Treatment_Id === 0
                        ? null
                        : appointment.Treatment_Id,
                    Patient_Id:
                      appointment.Patient_Id === 0
                        ? null
                        : appointment.Patient_Id,
                    notes: appointment.notes === "" ? null : appointment.notes,
                  }),
                },
                logOut,
              );
              toast.show("La cita se registró correctamente", {
                type: "success",
                placement: "top",
                duration: 3000,
              });
              router.back();
            } catch (error: any) {
              toast.show(
                getApiErrorMessage(
                  error,
                  "Ocurrió un error al registrar la cita",
                ),
                {
                  type: "danger",
                  placement: "top",
                  duration: 3000,
                },
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleUpdateAppointment = async () => {
    if (appointment.dateHour === originalAppointment.dateHour) {
      toast.show(
        "Por favor, seleccione un horario diferente para reprogramar la cita",
        {
          type: "danger",
          placement: "top",
          duration: 3000,
        },
      );
      return;
    }
    // Validar que la nueva fecha sea válida y no sea en el pasado
    if (!validateDate(appointment.dateHour.toISOString())) {
      toast.show("La fecha de la cita no es válida", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    const now = new Date();
    if (appointment.dateHour < now) {
      toast.show("La fecha de la cita no puede ser en el pasado", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    Alert.alert(
      "Reprogramar Cita",
      `La cita se reprogramará para el día ${appointment.dateHour.toLocaleDateString(
        "es-BO",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
      )}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Reprogramar Cita",
          onPress: async () => {
            try {
              setLoading(true);
              await fetchWithToken(
                `/appointments/${appointmentID}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    ...appointment,
                    notes: appointment.notes === "" ? null : appointment.notes,
                  }),
                },
                logOut,
              );
              toast.show("La cita se reprogramó exitosamente", {
                type: "success",
                placement: "top",
                duration: 3000,
              });
              router.back();
            } catch (error: any) {
              toast.show(
                getApiErrorMessage(
                  error,
                  "Ocurrió un error al reprogramar la cita",
                ),
                {
                  type: "danger",
                  placement: "top",
                  duration: 3000,
                },
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleDeleteAppointment = async () => {
    Alert.alert(
      "Eliminar Cita",
      "Está seguro que desea cancelar esta cita?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, Eliminar",
          onPress: async () => {
            try {
              setLoading(true);
              await fetchWithToken(
                `/appointments/${appointmentID}`,
                { method: "DELETE" },
                logOut,
              );
              toast.show("La cita fué cancelada", {
                type: "success",
                placement: "top",
                duration: 3000,
              });
              router.back();
            } catch (error: any) {
              toast.show(
                getApiErrorMessage(
                  error,
                  "Ocurrió un error al cancelar la cita",
                ),
                {
                  type: "danger",
                  placement: "top",
                  duration: 3000,
                },
              );
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsData, treatmentsData] = await Promise.all([
          fetchWithToken("/patients/names", { method: "GET" }, logOut),
          fetchWithToken("/treatments", { method: "GET" }, logOut),
        ]);

        const patients: [] = patientsData.map(
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
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // If this screen was opened from a request, fetch its phone number
    const fetchRequestPhone = async () => {
      if (!requestID) return;
      try {
        const data = await fetchWithToken(
          `/appointment-requests/${requestID}`,
          { method: "GET" },
          logOut,
        );
        // backend may return phoneNumber or phone
        setRequestPhoneNumber(data.phoneNumber ?? data.phone ?? null);
      } catch {
        // ignore silently; phone may not be available
      }
    };

    fetchRequestPhone();
  }, [logOut, requestID]);

  useEffect(() => {
    const fetchPatientPhone = async () => {
      const id = appointment.Patient_Id || (patientID ? Number(patientID) : 0);
      if (!id) {
        setPatientPhoneNumber(null);
        return;
      }
      try {
        const data = await fetchWithToken(
          `/patients/${id}`,
          { method: "GET" },
          logOut,
        );
        setPatientPhoneNumber(data.phoneNumber ?? data.phone ?? null);
      } catch {
        setPatientPhoneNumber(null);
      }
    };

    fetchPatientPhone();
  }, [appointment.Patient_Id, patientID, logOut]);

  if (loading) {
    return (
      <>
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
        <LinearGradient
          colors={["#018ABE", "#02457A", "#018ABE"]}
          className="top-0 right-0 left-0 absolute h-full"
        />
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#D6E8EE" />
          <Text className="mt-4 text-whiteBlue">Cargando datos...</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
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
      <LinearGradient
        colors={["#018ABE", "#02457A", "#018ABE"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 12,
          alignItems: "center",
        }}
      >
        <View className="flex-1 gap-2 w-full">
          {/* Patient */}
          {requestID && !isRequestPatientRegistered && (
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold text-whiteBlue text-center w-1/2 text-lg">
                Ya tiene registrado al paciente?
              </Text>
              <Pressable
                onPress={() => setIsRequestPatientRegistered(true)}
                className="bg-darkBlue justify-center active:bg-pureBlue px-4 py-1 border border-whiteBlue rounded-full"
              >
                <Text className="font-semibold text-whiteBlue">
                  {!isRequestPatientRegistered && "Si, Seleccionar paciente"}
                </Text>
              </Pressable>
            </View>
          )}
          {((requestID && isRequestPatientRegistered) || !requestID) && (
            <View className="flex-row justify-evenly items-center w-full h-14">
              <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
                Paciente:
              </Text>
              <DropdownComponent
                className="flex-1"
                disabled={patientID ? true : false}
                data={patientsList}
                value={appointment.Patient_Id.toString()}
                setValue={(val) => {
                  setAppoinment({ ...appointment, Patient_Id: +val });
                }}
              />
            </View>
          )}
          {/* Treatment */}
          <View className="flex-row justify-evenly items-center w-full h-14">
            <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
              Tratamiento:
            </Text>
            <DropdownComponent
              className="flex-1"
              disabled={patientID ? true : false}
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
              <Text className="w-1/3 font-bold text-whiteBlue text-lg text-center">
                Solicitado el:
              </Text>
              <View className="flex-1 items-center">
                <Text className="bg-blackBlue px-5 py-1 border border-whiteBlue rounded-full text-whiteBlue">
                  {sentRequestDate &&
                    new Date(sentRequestDate).toLocaleDateString("es-BO", {
                      weekday: "long",
                      day: "numeric",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
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
            <Pressable
              onPress={handleDeleteAppointment}
              disabled={loading}
              className={`flex-1 items-center my-2 py-2 border border-whiteBlue rounded-full ${loading ? "bg-gray-400" : "bg-red-600 active:bg-red-800"}`}
            >
              <Text className="font-semibold text-whiteBlue text-lg">
                Cancelar Cita
              </Text>
            </Pressable>
            <Pressable
              onPress={handleUpdateAppointment}
              disabled={loading}
              className={`flex-1 items-center my-2 py-2 border border-blackBlue rounded-full ${loading ? "bg-gray-400" : "bg-whiteBlue active:bg-lightBlue"}`}
            >
              <Text className="font-semibold text-blackBlue text-lg">
                Reprogramar
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row justify-center items-center gap-4 w-full px-2">
            {/* WhatsApp Confirmation button (only if opened from a request) */}
            {requestID && (
              <Pressable
                onPress={async () => {
                  const firstName =
                    (requestName || "").trim().split(/\s+/)[0] || "paciente";
                  const apptDate: Date =
                    appointment.dateHour instanceof Date
                      ? appointment.dateHour
                      : new Date(appointment.dateHour);
                  const now = new Date();
                  const isToday =
                    apptDate.getFullYear() === now.getFullYear() &&
                    apptDate.getMonth() === now.getMonth() &&
                    apptDate.getDate() === now.getDate();
                  const appointmentDay = apptDate.toLocaleDateString("es-BO", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
                  const appointmentHour = apptDate.toLocaleTimeString("es-BO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  const dayReference = isToday
                    ? "el día de hoy"
                    : `el ${appointmentDay}`;
                  const confirmationMsg = `Hola ${firstName}, recibí tu solicitud y te espero ${dayReference} a las ${appointmentHour} en el consultorio.\n-Dr. Alexander Ojalvo`;
                  let phoneToUse = patientPhoneNumber ?? requestPhoneNumber;

                  // If we don't have a phone yet, try fetching the request on demand
                  if (!phoneToUse && requestID) {
                    try {
                      const data = await fetchWithToken(
                        `/appointment-requests/${requestID}`,
                        { method: "GET" },
                        logOut,
                      );
                      phoneToUse = data.phoneNumber ?? data.phone ?? null;
                      // update state so future sends reuse it
                      setRequestPhoneNumber(phoneToUse);
                    } catch {
                      phoneToUse = null;
                    }
                  }

                  if (phoneToUse) {
                    const url = `https://wa.me/591${phoneToUse}?text=${encodeURIComponent(confirmationMsg)}`;
                    Linking.openURL(url);
                  } else {
                    toast.show(
                      "No se encontró número de teléfono del paciente ni de la solicitud.",
                      {
                        type: "danger",
                        placement: "top",
                        duration: 3000,
                      },
                    );
                  }
                }}
                disabled={loading}
                className={`flex-1 items-center my-2 py-2 border border-whiteBlue rounded-full px-4 ${loading ? "bg-gray-400" : "bg-whiteBlue active:bg-lightBlue"}`}
              >
                <Text className="font-semibold text-blackBlue text-lg">
                  Enviar confirmación
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handlePostAppointment}
              disabled={loading}
              className={`flex-1 items-center my-2 py-2 border border-whiteBlue rounded-full ${loading ? "bg-gray-400" : "bg-darkBlue active:bg-pureBlue"}`}
            >
              <Text className="font-semibold text-whiteBlue text-lg">
                {loading ? "Agendando..." : "Agendar"}
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      <DatePicker
        modal
        mode="datetime"
        minuteInterval={15}
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
