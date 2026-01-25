import { DaySchedule } from "@/components/appointments-requests/scheduleModes";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DayScheduleDetails() {
  const { day } = useLocalSearchParams();
  const date = typeof day === "string" ? new Date(day) : new Date();

  return (
    <>
      <LinearGradient
        colors={["#97CADB", "#02457A"]}
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
            headerTitle: "Detalles del Día",
            headerRight: () => <></>,
          }}
        />
        <DaySchedule date={date} />
      </SafeAreaView>
    </>
  );
}
