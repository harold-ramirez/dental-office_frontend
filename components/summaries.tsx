import { Text, View } from "react-native";

export function WeekSummary({ weekSummary }: { weekSummary: number[] }) {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const maxValue = Math.max(...weekSummary);
  const days = [
    { label: "L", dayIndex: 1 },
    { label: "M", dayIndex: 2 },
    { label: "X", dayIndex: 3 },
    { label: "J", dayIndex: 4 },
    { label: "V", dayIndex: 5 },
    { label: "S", dayIndex: 6 },
    { label: "D", dayIndex: 0 },
  ];

  return (
    <View className="flex-row gap-5 bg-lightBlue p-2 rounded-xl w-full h-44">
      {days.map((day) => {
        const value = weekSummary[day.dayIndex] || 0;
        const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

        return (
          <View key={day.label} className="flex-1 justify-end">
            <Text className="text-blackBlue text-center">{value}</Text>
            <View
              style={{ height: `${heightPercentage}%` }}
              className={`rounded-t-lg min-h-2 ${
                currentDayOfWeek === day.dayIndex
                  ? "bg-darkBlue"
                  : "bg-pureBlue"
              }`}
            />
            <Text className="font-semibold text-blackBlue text-center">
              {day.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function Summary({
  pendingRequests,
  tomorrow,
  currentWeek,
}: {
  pendingRequests: number;
  tomorrow: number;
  currentWeek: number;
}) {
  return (
    <View className="flex-row mb-5 w-full">
      <View className="flex-1">
        <Text className="font-semibold text-darkBlue text-3xl text-center">
          {pendingRequests}
        </Text>
        <Text className="text-blackBlue text-center">
          Solicitudes{`\n`}pendientes
        </Text>
      </View>
      <View className="mx-2 border-blackBlue border-r" />
      <View className="flex-1">
        <Text className="font-semibold text-darkBlue text-3xl text-center">
          {currentWeek}
        </Text>
        <Text className="text-blackBlue text-center">
          Citas{`\n`}esta semana
        </Text>
      </View>
      <View className="mx-2 border-blackBlue border-r" />
      <View className="flex-1">
        <Text className="font-semibold text-darkBlue text-3xl text-center">
          {tomorrow}
        </Text>
        <Text className="text-blackBlue text-center">Citas{`\n`}mañana</Text>
      </View>
    </View>
  );
}
