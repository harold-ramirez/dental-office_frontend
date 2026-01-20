import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CheckCircleIcon, PlusIcon } from "../Icons";

interface appointmentProps {
  patient?: string;
  treatment?: string;
}
interface appointmentSelectionProps {
  isAvailable?: boolean;
  dateId: number | null;
  setDateId: (id: number | null) => void;
}

export function DayAppointment({ patient, treatment }: appointmentProps) {
  return (
    <View className="items-end h-16">
      {patient ? (
        <Link
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: {
              selectedDate: new Date().toDateString(),
              patient: "Juanito",
            },
          }}
          asChild
        >
          <Pressable className="flex-row justify-between items-center bg-pureBlue active:bg-darkBlue mr-2 p-2 border border-blackBlue rounded-lg w-4/5 h-full">
            <Text className="font-bold text-whiteBlue text-lg">{patient}</Text>
            <Text className="font-semibold text-whiteBlue">{treatment}</Text>
          </Pressable>
        </Link>
      ) : (
        <Link
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: { selectedDate: new Date().toDateString() },
          }}
          asChild
        >
          <Pressable className="flex-row justify-center items-center active:bg-lightBlue mr-2 p-2 w-4/5 h-full">
            <PlusIcon size={45} color="#D6E8EE" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}

export function WeekAppointment({ patient }: appointmentProps) {
  return (
    <View className="h-16">
      {patient ? (
        <Link
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: {
              selectedDate: new Date().toDateString(),
              patient: "Juanito",
            },
          }}
          asChild
        >
          <Pressable className="justify-center items-center bg-pureBlue active:bg-darkBlue p-1 h-full">
            <Text className="font-bold text-whiteBlue text-sm text-center">
              {patient}
            </Text>
          </Pressable>
        </Link>
      ) : (
        <Link
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: { selectedDate: new Date().toDateString() },
          }}
          asChild
        >
          <Pressable className="justify-center items-center active:bg-lightBlue h-full">
            <PlusIcon size={32} color="#D6E8EE" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}

export function MonthAppointment({
  dayAppointments,
}: {
  dayAppointments: number;
}) {
  return (
    <Text className="bg-pureBlue py-1 font-bold text-whiteBlue text-xs text-center">
      {dayAppointments} registros
    </Text>
  );
}

export function AppointmentSelection({
  isAvailable,
  dateId,
  setDateId,
}: appointmentSelectionProps) {
  const [selected, setSelected] = useState(false);
  const selectDate = () => {
    setSelected(!selected);
  };

  return (
    <View className="h-16">
      {!isAvailable ? (
        <View className="bg-darkBlue h-full"></View>
      ) : (
        <Pressable
          onPress={selectDate}
          className={`active:bg-lightBlue h-full items-center justify-center ${
            selected ? `border-4 border-dashed border-darkBlue` : ``
          }`}
        >
          {selected && <CheckCircleIcon color={`#02457A`} size={32} />}
        </Pressable>
      )}
    </View>
  );
}
