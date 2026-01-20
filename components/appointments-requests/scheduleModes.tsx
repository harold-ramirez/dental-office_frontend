import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LeftArrowIcon, RightArrowIcon } from "../Icons";
import {
  AppointmentSelection,
  DayAppointment,
  MonthAppointment,
  WeekAppointment,
} from "./appointmentModes";

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
const currentWeek = () => {
  const today = new Date();
  const weekDay = today.getDay();
  const offsetLunes = weekDay === 0 ? -6 : 1 - weekDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offsetLunes);
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

export function DaySchedule({ date }: { date: Date | null }) {
  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      <Text className="mb-2 w-full font-bold text-blackBlue text-xl text-center capitalize">
        {date
          ? date.toLocaleDateString("es-BO", {
              weekday: "long",
              day: "2-digit",
            })
          : ""}
        /
        {date
          ? date.toLocaleDateString("es-BO", {
              month: "long",
            })
          : ""}
        /{date ? date.getFullYear() : ""}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View>
          {hours.map((hour) => (
            <View key={hour} className="w-full">
              <View className="flex-row items-center gap-3 w-full">
                <Text className="font-semibold text-blackBlue text-lg">
                  {hour}
                </Text>
                <View className="flex-1 border-t-2 border-blackBlue/50 rounded-full"></View>
              </View>
              {Math.floor(Math.random() * 5) === 3 ? (
                <DayAppointment patient="Juan Perez" treatment="Ortodoncia" />
              ) : (
                <DayAppointment />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function WeekSchedule() {
  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      <Text className="w-full font-bold text-blackBlue text-xl text-center capitalize">
        {currentWeek()}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-2">
          <View className="mt-5">
            {hours.map((hour) => (
              <Text key={hour} className="h-16 font-bold text-blackBlue">
                {hour}
              </Text>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-1 mr-2 mb-2">
              <View className="flex-row mb-1">
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((day) => (
                  <Text
                    key={day}
                    className="w-24 font-semibold text-blackBlue text-lg text-center"
                  >
                    {day}
                  </Text>
                ))}
              </View>
              {hours.map((hour) => (
                <View
                  key={hour}
                  className="flex-row border-t border-blackBlue h-16"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <View key={day} className="border-r border-blackBlue w-24">
                      {Math.floor(Math.random() * 9) === 3 ? (
                        <WeekAppointment patient="Juan Perez" />
                      ) : (
                        <WeekAppointment />
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

export function MonthSchedule() {
  return (
    <View className="flex-1 justify-center items-center bg-whiteBlue p-2 rounded-xl w-full">
      <View>
        <Text className="self-center mb-2 font-bold text-blackBlue text-xl text-center uppercase">
          {new Date().toLocaleDateString("es-BO", {
            month: "long",
          })}
          {" - "}
          {new Date().getFullYear()}
        </Text>

        <View className="flex-1 self-start">
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
          <View className="justify-center border-t border-l">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} className="flex-row h-24">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <Link
                    href={{
                      pathname: "/dayScheduleDetails/[day]",
                      params: {
                        day: new Date("2025-07-30T12:00:00").toDateString(),
                      },
                    }}
                    key={day}
                    asChild
                  >
                    <Pressable className="active:bg-lightBlue border-r border-b border-blackBlue w-14">
                      <Text className="mb-1 pl-1 font-semibold text-blackBlue text-sm">
                        {i * 7 + day}
                      </Text>
                      {Math.floor(Math.random() * 9) === 3 && (
                        <MonthAppointment dayAppointments={3} />
                      )}
                    </Pressable>
                  </Link>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export function WeekAppointmentSelect() {
  const [dateId, setDateId] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-whiteBlue p-2 rounded-xl w-full">
      <View className="flex-row justify-center items-center">
        <Pressable
          onPress={() => {}}
          className="active:bg-lightBlue p-1 justify-center items-center"
        >
          <LeftArrowIcon color="#02457A" size={32} />
        </Pressable>
        <Text className="flex-1 font-bold text-blackBlue text-xl text-center capitalize">
          {currentWeek()}
        </Text>
        <Pressable
          onPress={() => {}}
          className="active:bg-lightBlue p-1 justify-center items-center"
        >
          <RightArrowIcon color="#02457A" size={32} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-2">
          <View className="mt-5">
            {hours.map((hour) => (
              <Text key={hour} className="h-16 font-bold text-blackBlue">
                {hour}
              </Text>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-1 mr-2 mb-2">
              <View className="flex-row mb-1">
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((day) => (
                  <Text
                    key={day}
                    className="w-24 font-semibold text-blackBlue text-lg text-center"
                  >
                    {day}
                  </Text>
                ))}
              </View>
              {hours.map((hour) => (
                <View
                  key={hour}
                  className="flex-row border-t border-blackBlue h-16"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <View key={day} className="border-r border-blackBlue w-24">
                      {Math.floor(Math.random() * 9) === 3 ? (
                        <AppointmentSelection
                          dateId={dateId}
                          setDateId={setDateId}
                        />
                      ) : (
                        <AppointmentSelection
                          isAvailable
                          dateId={dateId}
                          setDateId={setDateId}
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
              {/* Wedenesday */}
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
                              }
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
                              }
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
                              }
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
