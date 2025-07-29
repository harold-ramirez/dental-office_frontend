import {
  DaySchedule,
  MonthSchedule,
  WeekSchedule,
} from "@/components/appointments-requests/scheduleModes";
import Loading from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "day" | "week" | "month";

export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<Mode>("day");

  const [hasRendered, setHasRendered] = useState<Record<Mode, boolean>>({
    day: true,
    week: false,
    month: false,
  });

  const handleModeChange = (mode: Mode) => {
    if (!hasRendered[mode]) {
      setIsLoading(true);
      setHasRendered((prev) => ({ ...prev, [mode]: true }));
    }
    setTimeout(() => {
      setActiveMode(mode);
    }, 0);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [activeMode]);

  return (
    <>
      <LinearGradient
        colors={["#02457A", "#97CADB"]}
        className="top-0 right-0 left-0 absolute h-full"
      />

      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8, gap: 12 }}
      >
        <Text className="font-bold text-white text-3xl text-center">
          Mi Agenda
        </Text>
        <View className="flex-row gap-2">
          {(["day", "week", "month"] as const).map((mode) => {
            const labels: Record<Mode, string> = {
              day: "Día",
              week: "Semana",
              month: "Mes",
            };
            return (
              <Pressable
                key={mode}
                onPress={() => handleModeChange(mode)}
                className={`justify-center items-center px-2 py-1 border-2 border-blackBlue rounded-full w-1/4 ${
                  activeMode === mode
                    ? `bg-blackBlue`
                    : `bg-lightBlue active:bg-pureBlue`
                }`}
              >
                <Text
                  className={`font-semibold capitalize ${
                    activeMode === mode ? `text-whiteBlue` : `text-blackBlue`
                  }`}
                >
                  {labels[mode]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="flex-1">
          {/* bg-whiteBlue p-2 rounded-xl */}
          {hasRendered.day && (
            <View
              style={{
                display: activeMode === "day" ? "flex" : "none",
                flex: 1,
              }}
            >
              <DaySchedule date={new Date()} />
            </View>
          )}
          {hasRendered.week && (
            <View
              style={{
                display: activeMode === "week" ? "flex" : "none",
                flex: 1,
              }}
            >
              <WeekSchedule />
            </View>
          )}
          {hasRendered.month && (
            <View
              style={{
                display: activeMode === "month" ? "flex" : "none",
                flex: 1,
              }}
            >
              <MonthSchedule />
            </View>
          )}
          {isLoading && <Loading />}
        </View>
      </SafeAreaView>
    </>
  );
}
