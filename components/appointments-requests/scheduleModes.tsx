import { fetchWithToken } from "@/services/fetchData";
import { FormatDuration } from "@/services/formatAppointmentDuration";
import { AuthContext } from "@/utils/authContext";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import {
  EditIcon,
  LeftArrowIcon,
  RightArrowIcon,
  WhatsappIcon,
} from "../Icons";
import PopupModal from "../popupModal";
import {
  AppointmentSelection,
  DayAppointment,
  WeekAppointment,
} from "./appointmentModes";

interface AppointmentDto {
  Id: number;
  dateHour: string;
  patient: string;
  treatment?: string | null;
  treatmentID?: number | null;
  patientID?: number;
  notes?: string | null;
  requestMessage?: string | null;
  requestID?: number | null;
  requestRegisterDate?: string | null;
  requestPhoneNumber?: string | null;
  patientPhoneNumber?: string | null;
  minutesDuration:
    | 15
    | 30
    | 45
    | 60
    | 75
    | 90
    | 105
    | 120
    | 135
    | 150
    | 165
    | 180;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const DAY_LABELS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
} as const;

const hours = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];
const getWeekRange = (isNextWeek: boolean = false) => {
  const today = new Date();
  const weekDay = today.getDay();
  const offsetLunes = weekDay === 0 ? -6 : 1 - weekDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offsetLunes + (isNextWeek ? 7 : 0));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayDate = `${monday.toLocaleDateString("es-BO", {
    day: "2-digit",
  })}/${monday.toLocaleDateString("es-BO", {
    month: "short",
  })}/${monday.getFullYear().toString().slice(2)}`;

  const sundayDate = `${sunday.toLocaleDateString("es-BO", {
    day: "2-digit",
  })}/${sunday.toLocaleDateString("es-BO", {
    month: "short",
  })}/${sunday.getFullYear().toString().slice(2)}`;

  return `${mondayDate}  -  ${sundayDate}`;
};

export function DaySchedule({
  date,
  refresh,
}: {
  date: Date;
  refresh: string;
}) {
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [todaySchedule, setTodaySchedule] = useState<AppointmentDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDto>({
      Id: 0,
      dateHour: "",
      patient: "",
      minutesDuration: 15,
      patientID: 0,
      treatment: null,
      notes: null,
      requestMessage: null,
      requestPhoneNumber: null,
      patientPhoneNumber: null,
    });

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await fetchWithToken(
          "/users/wa-message",
          { method: "GET" },
          logOut,
        );
        setWhatsappMessage(data.defaultMessage);
      } catch {
        toast.show("Error al obtener mensaje de WhatsApp", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      }
    };
    fetchMessage();
  }, [logOut, toast]);

  useEffect(() => {
    const makeSchedule = (appointments: any[]) => {
      const result: AppointmentDto[] = [];
      const iHour = new Date(date);
      iHour.setHours(
        Number(hours[0].split(":")[0]),
        Number(hours[0].split(":")[1]),
        0,
        0,
      );

      while (
        iHour.getHours() <= Number(hours[hours.length - 1].split(":")[0])
      ) {
        const appointment = appointments.find((appointment) =>
          appointment.dateHour.includes(
            iHour.toISOString().split("T")[1].split(".")[0].slice(0, 5),
          ),
        );

        let step:
          | 15
          | 30
          | 45
          | 60
          | 75
          | 90
          | 105
          | 120
          | 135
          | 150
          | 165
          | 180 = 15;

        if (appointment) {
          // Cita
          result.push(appointment);
          step = appointment.minutesDuration;
        } else {
          // Relleno
          step = iHour.getMinutes().toString().endsWith("5") ? 15 : 30;
          result.push({
            Id: 0,
            dateHour: iHour.toISOString(),
            treatment: null,
            patientID: 0,
            patient: "",
            minutesDuration: step,
          });
        }

        iHour.setMinutes(iHour.getMinutes() + step);
      }

      setTodaySchedule(result);
    };

    const fetchAppointments = async () => {
      const data = await fetchWithToken(
        `/appointments/day/${date.toISOString()}`,
        { method: "GET" },
        logOut,
      );
      makeSchedule(data);
    };

    const timeoutId = setTimeout(fetchAppointments, 1000);
    return () => clearTimeout(timeoutId);
  }, [date, refresh, logOut]);

  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      <Text className="mb-2 w-full font-bold text-blackBlue text-xl text-center capitalize">
        {date
          ? date.toLocaleDateString("es-BO", {
              weekday: "long",
              day: "2-digit",
            })
          : ""}{" "}
        /{" "}
        {date
          ? date.toLocaleDateString("es-BO", {
              month: "long",
            })
          : ""}{" "}
        / {date ? date.getFullYear() : ""}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Grid */}
        <View className="flex-row gap-2">
          {/* Hours */}
          <View>
            {hours.map((hour, i) => (
              <Text key={i} className="h-[80px] text-blackBlue">
                {hour}
              </Text>
            ))}
            <Text className="text-blackBlue">20:00</Text>
          </View>

          {/*  */}
          <View className="flex-1 mt-3">
            {todaySchedule.map((appointment, i) => {
              // Calcular si la fecha es pasada
              const appointmentDate = new Date(appointment.dateHour);
              const today = new Date();
              const isDayPassed = appointmentDate < today;

              return (
                <View key={i}>
                  {appointment.Id === 0 ? (
                    <DayAppointment
                      dateHour={appointment.dateHour}
                      duration={appointment.minutesDuration}
                      isDisabled={isDayPassed}
                    />
                  ) : (
                    <DayAppointment
                      patient={appointment.patient}
                      duration={appointment.minutesDuration}
                      treatment={appointment.treatment ?? "-"}
                      onPress={() => {
                        setSelectedAppointment(appointment);
                        setModalVisible(true);
                      }}
                    />
                  )}
                </View>
              );
            })}
            <View className="border-blackBlue border-t" />
          </View>
        </View>
      </ScrollView>
      {/* Appointment Details */}
      <ModalDetails
        defaultMessage={whatsappMessage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedAppointment={selectedAppointment}
      />
    </View>
  );
}

export function WeekSchedule({ refresh }: { refresh: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [currentWeekView, setCurrentWeekView] = useState<"current" | "next">(
    "current",
  );
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDto>({
      Id: 0,
      dateHour: "",
      patient: "",
      minutesDuration: 15,
      patientID: 0,
      treatment: null,
      notes: null,
      requestID: null,
      requestMessage: null,
      requestPhoneNumber: null,
      patientPhoneNumber: null,
    });
  const [allWeeksSchedule, setAllWeeksSchedule] = useState<{
    currentWeek: {
      monday: AppointmentDto[];
      tuesday: AppointmentDto[];
      wednesday: AppointmentDto[];
      thursday: AppointmentDto[];
      friday: AppointmentDto[];
      saturday: AppointmentDto[];
      sunday: AppointmentDto[];
    };
    nextWeek: {
      monday: AppointmentDto[];
      tuesday: AppointmentDto[];
      wednesday: AppointmentDto[];
      thursday: AppointmentDto[];
      friday: AppointmentDto[];
      saturday: AppointmentDto[];
      sunday: AppointmentDto[];
    };
  }>({
    currentWeek: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    nextWeek: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  });

  const weekSchedule =
    currentWeekView === "current"
      ? allWeeksSchedule.currentWeek
      : allWeeksSchedule.nextWeek;

  useEffect(() => {
    const makeSchedule = (
      appointments: AppointmentDto[],
      day: string,
      dayIndex: number,
      isNextWeek: boolean = false,
    ) => {
      const result: AppointmentDto[] = [];
      const today = new Date();
      const weekDay = today.getDay();
      const offsetLunes = weekDay === 0 ? -6 : 1 - weekDay;
      const monday = new Date(today);
      monday.setDate(today.getDate() + offsetLunes + (isNextWeek ? 7 : 0));
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + dayIndex);
      const iHour = new Date(dayDate);
      iHour.setHours(
        Number(hours[0].split(":")[0]),
        Number(hours[0].split(":")[1]),
        0,
        0,
      );

      let fillerId = 0 - dayIndex * 100 - (isNextWeek ? 1000 : 0);
      while (
        iHour.getHours() <= Number(hours[hours.length - 1].split(":")[0])
      ) {
        const appointment = appointments.find((appointment) =>
          appointment.dateHour.includes(
            iHour.toISOString().split("T")[1].split(".")[0].slice(0, 5),
          ),
        );

        let step:
          | 15
          | 30
          | 45
          | 60
          | 75
          | 90
          | 105
          | 120
          | 135
          | 150
          | 165
          | 180 = 15;

        if (appointment) {
          // Cita
          result.push(appointment);
          step = appointment.minutesDuration;
        } else {
          // Relleno
          step = iHour.getMinutes().toString().endsWith("5") ? 15 : 30;
          fillerId--;
          result.push({
            Id: fillerId,
            dateHour: iHour.toISOString(),
            patient: "",
            minutesDuration: step,
          });
        }

        iHour.setMinutes(iHour.getMinutes() + step);
      }
      return result;
    };

    const fetchAppointments = async () => {
      try {
        const data = await fetchWithToken(
          `/appointments/week`,
          { method: "GET" },
          logOut,
        );

        setAllWeeksSchedule({
          currentWeek: {
            monday: makeSchedule(data.currentWeek.monday, "monday", 0, false),
            tuesday: makeSchedule(
              data.currentWeek.tuesday,
              "tuesday",
              1,
              false,
            ),
            wednesday: makeSchedule(
              data.currentWeek.wednesday,
              "wednesday",
              2,
              false,
            ),
            thursday: makeSchedule(
              data.currentWeek.thursday,
              "thursday",
              3,
              false,
            ),
            friday: makeSchedule(data.currentWeek.friday, "friday", 4, false),
            saturday: makeSchedule(
              data.currentWeek.saturday,
              "saturday",
              5,
              false,
            ),
            sunday: makeSchedule(data.currentWeek.sunday, "sunday", 6, false),
          },
          nextWeek: {
            monday: makeSchedule(data.nextWeek.monday, "monday", 0, true),
            tuesday: makeSchedule(data.nextWeek.tuesday, "tuesday", 1, true),
            wednesday: makeSchedule(
              data.nextWeek.wednesday,
              "wednesday",
              2,
              true,
            ),
            thursday: makeSchedule(data.nextWeek.thursday, "thursday", 3, true),
            friday: makeSchedule(data.nextWeek.friday, "friday", 4, true),
            saturday: makeSchedule(data.nextWeek.saturday, "saturday", 5, true),
            sunday: makeSchedule(data.nextWeek.sunday, "sunday", 6, true),
          },
        });
      } catch {
        toast.show("Error al cargar las citas semanales", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      }
    };

    const timeoutId = setTimeout(fetchAppointments, 1000);
    return () => clearTimeout(timeoutId);
  }, [refresh, logOut, toast]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await fetchWithToken(
          "/users/wa-message",
          { method: "GET" },
          logOut,
        );
        setWhatsappMessage(data.defaultMessage);
      } catch {
        toast.show("Error al obtener mensaje de WhatsApp", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      }
    };
    fetchMessage();
  }, [logOut, toast]);

  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      {/* Header */}
      <View className="flex-row justify-center items-center mb-2">
        {/* Go to previous week */}
        <Pressable
          onPress={() => setCurrentWeekView("current")}
          disabled={currentWeekView === "current"}
          className={`justify-center items-center p-1 ${currentWeekView === "current" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <LeftArrowIcon color="#02457A" size={32} />
        </Pressable>
        {/* Week Text */}
        <Text className="flex-1 font-bold text-blackBlue text-xl text-center capitalize">
          {getWeekRange(currentWeekView === "next")}
        </Text>
        {/* Go to next week */}
        <Pressable
          onPress={() => setCurrentWeekView("next")}
          disabled={currentWeekView === "next"}
          className={`justify-center items-center p-1 ${currentWeekView === "next" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <RightArrowIcon color="#02457A" size={32} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-2">
          {/* Hours */}
          <View className="pt-4">
            {hours.map((hour, i) => (
              <Text key={i} className="h-[80px] text-blackBlue">
                {hour}
              </Text>
            ))}
            <Text className="text-blackBlue">20:00</Text>
          </View>

          {/* Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row pr-2">
              {DAYS.map((day) => (
                <View key={day} className="flex-1 w-24">
                  <Text className="w-24 font-semibold text-blackBlue text-lg text-center">
                    {DAY_LABELS[day]}
                  </Text>
                  {weekSchedule[day].map((appointment, i) => {
                    // Calcular si la fecha es pasada
                    const appointmentDate = new Date(appointment.dateHour);
                    const today = new Date();
                    const isDayPassed = appointmentDate < today;

                    return (
                      <View key={i} className="border-blackBlue border-r">
                        {appointment.Id <= 0 ? (
                          <WeekAppointment
                            duration={appointment.minutesDuration}
                            dateHour={appointment.dateHour}
                            isDisabled={isDayPassed}
                          />
                        ) : (
                          <WeekAppointment
                            duration={appointment.minutesDuration}
                            patient={appointment.patient}
                            onPress={() => {
                              setSelectedAppointment(appointment);
                              setModalVisible(true);
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Appointment Details */}
      <ModalDetails
        defaultMessage={whatsappMessage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedAppointment={selectedAppointment}
      />
    </View>
  );
}

export function MonthSchedule({ refresh }: { refresh: string }) {
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [currentMonthView, setCurrentMonthView] = useState<"current" | "next">(
    "current",
  );
  const today = new Date();

  // Calculate month based on view
  const monthOffset = currentMonthView === "next" ? 1 : 0;
  const targetDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const currentMonth = targetDate.getMonth();
  const currentYear = targetDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDay.getDay();
  const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = adjustedStartDay + lastDay;
  const totalRows = Math.ceil(totalCells / 7);
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays =
    adjustedStartDay > 0
      ? Array.from(
          { length: adjustedStartDay },
          (_, i) => prevMonthLastDay - adjustedStartDay + i + 1,
        )
      : [];
  const currentMonthDays = Array.from({ length: lastDay }, (_, i) => i + 1);
  const nextMonthDays = Array.from(
    { length: totalRows * 7 - totalCells },
    (_, i) => i + 1,
  );
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const [allMonthsAppointments, setAllMonthsAppointments] = useState<{
    currentMonth: { day: string; count: number }[];
    nextMonth: { day: string; count: number }[];
  }>({
    currentMonth: [],
    nextMonth: [],
  });

  const monthAppointments =
    currentMonthView === "current"
      ? allMonthsAppointments.currentMonth
      : allMonthsAppointments.nextMonth;

  const appointmentMap = new Map(
    monthAppointments.map((item) => {
      // Parsear la fecha correctamente como fecha local, no UTC
      const dateParts = item.day.split("T")[0].split("-");
      const localDate = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
      );
      return [localDate.toDateString(), item.count];
    }),
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await fetchWithToken(
          `/appointments/month`,
          { method: "GET" },
          logOut,
        );
        setAllMonthsAppointments({
          currentMonth: data.currentMonth,
          nextMonth: data.nextMonth,
        });
      } catch {
        toast.show("Error al cargar las citas mensuales", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      }
    };

    const timeoutId = setTimeout(fetchAppointments, 1000);
    return () => clearTimeout(timeoutId);
  }, [refresh, logOut, toast]);

  return (
    <View className="flex-1 justify-center items-center bg-whiteBlue p-2 rounded-xl w-full">
      {/* Month Title */}
      <View className="flex-row justify-center items-center mb-2 w-full">
        {/* Go to previous month */}
        <Pressable
          onPress={() => setCurrentMonthView("current")}
          disabled={currentMonthView === "current"}
          className={`justify-center items-center p-1 ${currentMonthView === "current" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <LeftArrowIcon color="#02457A" size={32} />
        </Pressable>
        {/* Month Text */}
        <Text className="flex-1 font-bold text-blackBlue text-xl text-center uppercase">
          {targetDate.toLocaleDateString("es-BO", {
            month: "long",
          })}
          {" - "}
          {targetDate.getFullYear()}
        </Text>
        {/* Go to next month */}
        <Pressable
          onPress={() => setCurrentMonthView("next")}
          disabled={currentMonthView === "next"}
          className={`justify-center items-center p-1 ${currentMonthView === "next" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <RightArrowIcon color="#02457A" size={32} />
        </Pressable>
      </View>

      <View className="flex-1 self-start">
        {/* Days */}
        <View className="flex-row mb-1">
          {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
            <Text
              key={day}
              className="w-14 font-semibold text-blackBlue text-lg text-center"
            >
              {day}
            </Text>
          ))}
        </View>
        {/* Month Grid */}
        <View className="justify-center border-t border-l">
          {Array.from({ length: totalRows }).map((_, weekIndex) => (
            <View key={weekIndex} className="flex-row h-24">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const cellIndex = weekIndex * 7 + dayIndex;
                const dayNumber = allDays[cellIndex];
                const isCurrentMonth =
                  cellIndex >= adjustedStartDay &&
                  cellIndex < adjustedStartDay + lastDay;

                const dateKey = new Date(
                  currentYear,
                  currentMonth,
                  dayNumber,
                ).toDateString();
                const appointmentCount = isCurrentMonth
                  ? (appointmentMap.get(dateKey) ?? 0)
                  : 0;

                return (
                  <Link
                    asChild
                    key={cellIndex}
                    href={{
                      pathname: "/dayScheduleDetails/[day]",
                      params: {
                        day: new Date(dateKey).toISOString(),
                      },
                    }}
                  >
                    <Pressable
                      disabled={!isCurrentMonth}
                      className={`border-blackBlue border-r border-b w-14 justify-start pt-1 ${
                        isCurrentMonth
                          ? "active:bg-lightBlue bg-whiteBlue"
                          : "bg-darkBlue"
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          <Text className="pl-1 font-semibold text-blackBlue text-sm">
                            {dayNumber}
                          </Text>
                          {appointmentCount > 0 && (
                            <Text className="bg-pureBlue py-1 font-bold text-whiteBlue text-xs text-center">
                              {appointmentCount} registros
                            </Text>
                          )}
                        </>
                      )}
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function WeekAppointmentSelect({
  setSelectesDate,
}: {
  setSelectesDate: (val: Date) => void;
}) {
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [currentWeekView, setCurrentWeekView] = useState<"current" | "next">(
    "current",
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDto>({
      Id: 0,
      dateHour: "",
      patient: "",
      minutesDuration: 15,
      patientID: 0,
      treatment: null,
      notes: null,
      requestMessage: null,
      requestPhoneNumber: null,
      patientPhoneNumber: null,
    });
  const [allWeeksSchedule, setAllWeeksSchedule] = useState<{
    currentWeek: {
      monday: AppointmentDto[];
      tuesday: AppointmentDto[];
      wednesday: AppointmentDto[];
      thursday: AppointmentDto[];
      friday: AppointmentDto[];
      saturday: AppointmentDto[];
      sunday: AppointmentDto[];
    };
    nextWeek: {
      monday: AppointmentDto[];
      tuesday: AppointmentDto[];
      wednesday: AppointmentDto[];
      thursday: AppointmentDto[];
      friday: AppointmentDto[];
      saturday: AppointmentDto[];
      sunday: AppointmentDto[];
    };
  }>({
    currentWeek: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    nextWeek: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  });

  const weekSchedule =
    currentWeekView === "current"
      ? allWeeksSchedule.currentWeek
      : allWeeksSchedule.nextWeek;

  useEffect(() => {
    const makeSchedule = (
      appointments: AppointmentDto[],
      day: string,
      dayIndex: number,
      isNextWeek: boolean = false,
    ) => {
      const result: AppointmentDto[] = [];
      const today = new Date();
      const weekDay = today.getDay();
      const offsetLunes = weekDay === 0 ? -6 : 1 - weekDay;
      const monday = new Date(today);
      monday.setDate(today.getDate() + offsetLunes + (isNextWeek ? 7 : 0));
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + dayIndex);
      const iHour = new Date(dayDate);
      iHour.setHours(
        Number(hours[0].split(":")[0]),
        Number(hours[0].split(":")[1]),
        0,
        0,
      );

      let fillerId = 0 - dayIndex * 100 - (isNextWeek ? 1000 : 0);
      while (
        iHour.getHours() <= Number(hours[hours.length - 1].split(":")[0])
      ) {
        const appointment = appointments.find((appointment) =>
          appointment.dateHour.includes(
            iHour.toISOString().split("T")[1].split(".")[0].slice(0, 5),
          ),
        );

        let step:
          | 15
          | 30
          | 45
          | 60
          | 75
          | 90
          | 105
          | 120
          | 135
          | 150
          | 165
          | 180 = 15;

        if (appointment) {
          // Cita
          result.push(appointment);
          step = appointment.minutesDuration;
        } else {
          // Relleno
          step = iHour.getMinutes().toString().endsWith("5") ? 15 : 30;
          fillerId--;
          result.push({
            Id: fillerId,
            dateHour: iHour.toISOString(),
            patient: "",
            minutesDuration: step,
          });
        }

        iHour.setMinutes(iHour.getMinutes() + step);
      }
      return result;
    };

    const fetchAppointments = async () => {
      try {
        const data = await fetchWithToken(
          "/appointments/week",
          { method: "GET" },
          logOut,
        );

        setAllWeeksSchedule({
          currentWeek: {
            monday: makeSchedule(data.currentWeek.monday, "monday", 0, false),
            tuesday: makeSchedule(
              data.currentWeek.tuesday,
              "tuesday",
              1,
              false,
            ),
            wednesday: makeSchedule(
              data.currentWeek.wednesday,
              "wednesday",
              2,
              false,
            ),
            thursday: makeSchedule(
              data.currentWeek.thursday,
              "thursday",
              3,
              false,
            ),
            friday: makeSchedule(data.currentWeek.friday, "friday", 4, false),
            saturday: makeSchedule(
              data.currentWeek.saturday,
              "saturday",
              5,
              false,
            ),
            sunday: makeSchedule(data.currentWeek.sunday, "sunday", 6, false),
          },
          nextWeek: {
            monday: makeSchedule(data.nextWeek.monday, "monday", 0, true),
            tuesday: makeSchedule(data.nextWeek.tuesday, "tuesday", 1, true),
            wednesday: makeSchedule(
              data.nextWeek.wednesday,
              "wednesday",
              2,
              true,
            ),
            thursday: makeSchedule(data.nextWeek.thursday, "thursday", 3, true),
            friday: makeSchedule(data.nextWeek.friday, "friday", 4, true),
            saturday: makeSchedule(data.nextWeek.saturday, "saturday", 5, true),
            sunday: makeSchedule(data.nextWeek.sunday, "sunday", 6, true),
          },
        });
      } catch {
        toast.show("Error al cargar las citas semanales", {
          type: "danger",
          placement: "top",
          duration: 3000,
        });
      }
    };

    const timeoutId = setTimeout(fetchAppointments, 1000);
    return () => clearTimeout(timeoutId);
  }, [logOut, toast]);

  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      {/* Header */}
      <View className="flex-row justify-center items-center">
        {/* Go to previous week */}
        <Pressable
          onPress={() => setCurrentWeekView("current")}
          disabled={currentWeekView === "current"}
          className={`justify-center items-center p-1 ${currentWeekView === "current" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <LeftArrowIcon color="#02457A" size={32} />
        </Pressable>
        {/* Week Text */}
        <Text className="flex-1 font-bold text-blackBlue text-xl text-center capitalize">
          {getWeekRange(currentWeekView === "next")}
        </Text>
        {/* Go to next week */}
        <Pressable
          onPress={() => setCurrentWeekView("next")}
          disabled={currentWeekView === "next"}
          className={`justify-center items-center p-1 ${currentWeekView === "next" ? "opacity-30" : "active:bg-lightBlue"}`}
        >
          <RightArrowIcon color="#02457A" size={32} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-2">
          {/* Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row px-2 gap-5">
              {DAYS.map((day) => (
                <View key={day} className="flex-1 w-24 gap-1">
                  <Text className="w-24 font-semibold text-blackBlue text-lg text-center">
                    {DAY_LABELS[day]}
                  </Text>
                  {weekSchedule[day].map((appointment, i) => (
                    <View key={i}>
                      {appointment.Id <= 0 ? (
                        <AppointmentSelection
                          isAvailable={
                            new Date(appointment.dateHour) > new Date()
                          }
                          hour={new Date(
                            appointment.dateHour,
                          ).toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                          isSelected={selectedAppointment.Id === appointment.Id}
                          duration={appointment.minutesDuration}
                          onPress={() => {
                            setSelectedAppointment(appointment);
                            setSelectesDate(new Date(appointment.dateHour));
                          }}
                        />
                      ) : (
                        <AppointmentSelection
                          isAvailable={false}
                          hour={new Date(
                            appointment.dateHour,
                          ).toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                          duration={appointment.minutesDuration}
                        />
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export function WorkScheduleSelection({
  setShifts,
  shifts,
}: {
  setShifts: (val: any) => void;
  shifts: {
    Monday: { Id: number; hour: string; status: boolean }[];
    Tuesday: { Id: number; hour: string; status: boolean }[];
    Wednesday: { Id: number; hour: string; status: boolean }[];
    Thursday: { Id: number; hour: string; status: boolean }[];
    Friday: { Id: number; hour: string; status: boolean }[];
    Saturday: { Id: number; hour: string; status: boolean }[];
    Sunday: { Id: number; hour: string; status: boolean }[];
  };
}) {
  return (
    <View className="flex-1 bg-whiteBlue pt-1 rounded-xl w-full">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-3">
          {/* Hours */}
          <View className="mt-5">
            {hours.map((hour) => (
              <Text key={hour} className="h-10 font-bold text-blackBlue">
                {hour}
              </Text>
            ))}
          </View>
          {/* Schedule Container */}
          <View className="self-start">
            {/* Day Titles */}
            <View className="flex-row self-start mb-1">
              {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
                <Text
                  key={i}
                  className="w-12 font-semibold text-blackBlue text-lg text-center"
                >
                  {day}
                </Text>
              ))}
            </View>
            {/* Content */}
            <View className="flex-row">
              {/* Monday */}
              <View>
                {shifts.Monday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Monday: [...shifts.Monday].map((mondayShift) => {
                              if (mondayShift.Id === currentShift.Id) {
                                return {
                                  ...mondayShift,
                                  status: !mondayShift.status,
                                };
                              }
                              return mondayShift;
                            }),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Tuesday */}
              <View>
                {shifts.Tuesday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Tuesday: [...shifts.Tuesday].map((tuesdayShift) => {
                              if (tuesdayShift.Id === currentShift.Id) {
                                return {
                                  ...tuesdayShift,
                                  status: !tuesdayShift.status,
                                };
                              }
                              return tuesdayShift;
                            }),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Wednesday */}
              <View>
                {shifts.Wednesday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Wednesday: [...shifts.Wednesday].map(
                              (wednesdayShift) => {
                                if (wednesdayShift.Id === currentShift.Id) {
                                  return {
                                    ...wednesdayShift,
                                    status: !wednesdayShift.status,
                                  };
                                }
                                return wednesdayShift;
                              },
                            ),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Thursday */}
              <View>
                {shifts.Thursday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Thursday: [...shifts.Thursday].map(
                              (thursdayShift) => {
                                if (thursdayShift.Id === currentShift.Id) {
                                  return {
                                    ...thursdayShift,
                                    status: !thursdayShift.status,
                                  };
                                }
                                return thursdayShift;
                              },
                            ),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Friday */}
              <View>
                {shifts.Friday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Friday: [...shifts.Friday].map((fridayShift) => {
                              if (fridayShift.Id === currentShift.Id) {
                                return {
                                  ...fridayShift,
                                  status: !fridayShift.status,
                                };
                              }
                              return fridayShift;
                            }),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Saturday */}
              <View>
                {shifts.Saturday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Saturday: [...shifts.Saturday].map(
                              (saturdayShift) => {
                                if (saturdayShift.Id === currentShift.Id) {
                                  return {
                                    ...saturdayShift,
                                    status: !saturdayShift.status,
                                  };
                                }
                                return saturdayShift;
                              },
                            ),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Sunday */}
              <View>
                {shifts.Sunday.map((currentShift) => (
                  <View
                    key={currentShift.Id}
                    className="flex-row self-start h-10"
                  >
                    <View className="border-whiteBlue border-t border-r w-12">
                      <Pressable
                        onPress={() =>
                          setShifts({
                            ...shifts,
                            Sunday: [...shifts.Sunday].map((sundayShift) => {
                              if (sundayShift.Id === currentShift.Id) {
                                return {
                                  ...sundayShift,
                                  status: !sundayShift.status,
                                };
                              }
                              return sundayShift;
                            }),
                          })
                        }
                        className={`h-10 items-center active:bg-pureBlue justify-center ${
                          currentShift.status ? `bg-darkBlue` : `bg-lightBlue`
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function ModalDetails({
  modalVisible,
  setModalVisible,
  selectedAppointment,
  defaultMessage,
}: {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  selectedAppointment: AppointmentDto;
  defaultMessage: string;
}) {
  return (
    <PopupModal
      showModal={modalVisible}
      setShowModal={setModalVisible}
      customDesign
    >
      <View className="flex-1 items-center w-full">
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 w-full"
        />
        <View className="bg-darkBlue px-4 py-4 rounded-t-2xl w-full">
          {/* Patient's Name */}
          <Text className="font-bold text-whiteBlue text-2xl text-center">
            {selectedAppointment.patient}
          </Text>
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
                  endAppt.getMinutes() + selectedAppointment.minutesDuration,
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
              {selectedAppointment.treatment ?? "-"}
            </Text>
          </View>
          {/* Notes */}
          {selectedAppointment.notes && (
            <View
              className={`gap-1 ${
                !selectedAppointment.notes ? `flex-row justify-between` : `mb-2`
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
                {selectedAppointment.notes ?? "-"}
              </Text>
            </View>
          )}
          {/* Request Message */}
          {selectedAppointment.requestMessage && (
            <View
              className={`gap-1 ${
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
                className={`rounded-md italic border border-whiteBlue ${
                  selectedAppointment.requestMessage
                    ? `bg-darkBlue p-2 text-whiteBlue text-center`
                    : `text-whiteBlue`
                }`}
              >
                {selectedAppointment.requestMessage
                  ? `"${selectedAppointment.requestMessage}"`
                  : "-"}
              </Text>
            </View>
          )}

          <View className="flex-row mt-5 justify-between">
            {/* Edit Button */}
            <Link
              asChild
              href={{
                pathname: "/(protected)/createAppointment/[selectedDate]",
                params: {
                  appointmentID: selectedAppointment.Id,
                  selectedDate: selectedAppointment.dateHour,
                  patientID: selectedAppointment.patientID,
                  requestID: selectedAppointment.requestID,
                  duration: selectedAppointment.minutesDuration.toString(),
                  notes: selectedAppointment.notes,
                  treatment: selectedAppointment.treatmentID,
                  sentRequestDate: selectedAppointment.requestRegisterDate,
                },
              }}
            >
              <Pressable className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-pureBlue px-4 py-2 rounded-md">
                <EditIcon color="#D6E8EE" />
                <Text className="text-whiteBlue font-semibold">
                  Reprogramar
                </Text>
              </Pressable>
            </Link>
            {/* WA Button */}
            {(selectedAppointment.patientPhoneNumber ||
              selectedAppointment.requestPhoneNumber) && (
              <Pressable
                onPress={() => {
                  const msg = defaultMessage
                    ? encodeURIComponent(defaultMessage)
                    : "";
                  const url = `https://wa.me/591${selectedAppointment.requestPhoneNumber ?? selectedAppointment.patientPhoneNumber}?text=${msg}`;
                  Linking.openURL(url);
                }}
                className="flex-row justify-center items-center gap-2 bg-green-700 active:bg-green-600 px-4 py-1 rounded-md"
              >
                <WhatsappIcon color="#D6E8EE" />
                <Text className="font-semibold text-whiteBlue">Mensaje</Text>
              </Pressable>
            )}
          </View>
          <View className="h-16" />
        </View>
      </View>
    </PopupModal>
  );
}
