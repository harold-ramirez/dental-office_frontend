import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { PlusIcon } from "../Icons";

interface appointmentProps {
  patient?: string;
  treatment?: string;
  dateHour?: string;
  duration?: 15 | 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150 | 165 | 180;
  onPress?: () => void;
}

export function DayAppointment(props: appointmentProps) {
  const {
    patient,
    treatment,
    onPress,
    dateHour = new Date().toISOString(),
    duration = 30,
  } = props;
  const heightPx = (duration / 15) * 40;

  return (
    <View
      className={`w-full border-blackBlue ${duration !== 15 || patient ? `border-t` : ``}`}
      style={{ height: heightPx }}
    >
      {patient ? (
        <Pressable
          onPress={onPress}
          className="flex-row justify-between items-center gap-3 bg-pureBlue active:bg-darkBlue p-2 rounded-xl h-full"
        >
          <Text className="flex-1 font-bold text-whiteBlue text-lg shrink">
            {patient}
          </Text>
          <Text className="flex-1 font-semibold text-whiteBlue text-right shrink">
            {treatment}
          </Text>
        </Pressable>
      ) : (
        <Link
          asChild
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: {
              selectedDate: dateHour,
            },
          }}
        >
          <Pressable className="flex-row justify-center items-center active:bg-lightBlue h-full">
            <PlusIcon size={45} color="#D6E8EE" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}

export function WeekAppointment(props: appointmentProps) {
  const {
    duration = 30,
    patient,
    onPress,
    dateHour = new Date().toISOString(),
  } = props;
  const heightPx = (duration / 15) * 40;

  return (
    <View
      style={{ height: heightPx }}
      className={`w-full border-blackBlue ${duration !== 15 || patient ? `border-t` : ``}`}
    >
      {patient ? (
        <Pressable
          onPress={onPress}
          className="justify-center items-center bg-pureBlue active:bg-darkBlue p-1 h-full"
        >
          <Text className="flex-1 font-bold text-whiteBlue text-sm text-center shrink">
            {patient}
          </Text>
        </Pressable>
      ) : (
        <Link
          asChild
          href={{
            pathname: "/createAppointment/[selectedDate]",
            params: {
              selectedDate: dateHour,
            },
          }}
        >
          <Pressable className="justify-center items-center active:bg-lightBlue h-full">
            <PlusIcon size={32} color="#D6E8EE" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}

interface appointmentSelectionProps {
  isAvailable?: boolean;
  isSelected?: boolean;
  hour?: string;
  duration?: 15 | 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150 | 165 | 180;
  onPress?: () => void;
}

export function AppointmentSelection({
  isAvailable,
  isSelected,
  hour,
  duration = 30,
  onPress,
}: appointmentSelectionProps) {
  const heightPx = (duration / 15) * 20 + (duration / 15 - 1) * 4;

  return (
    <View style={{ height: heightPx }} className={"w-full"}>
      {!isAvailable ? (
        <View className="justify-center items-center bg-gray-500/50 h-full">
          <Text className="font-semibold text-whiteBlue">{hour}</Text>
        </View>
      ) : (
        <Pressable
          onPress={onPress}
          disabled={isSelected}
          className={`active:bg-pureBlue h-full items-center justify-center ${
            isSelected ? `bg-darkBlue` : `bg-lightBlue`
          }`}
        >
          <Text
            className={`font-semibold ${isSelected ? "text-whiteBlue" : "text-blackBlue"}`}
          >
            {hour}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
