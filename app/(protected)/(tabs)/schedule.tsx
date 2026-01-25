import {
  DaySchedule,
  MonthSchedule,
  WeekSchedule,
} from "@/components/appointments-requests/scheduleModes";
import { RepeatIcon } from "@/components/Icons";
import Loading from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "day" | "week" | "month";

export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState<string>(new Date().toISOString());
  const [activeMode, setActiveMode] = useState<Mode>("day");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotateValue] = useState(new Animated.Value(0));

  const handleModeChange = (mode: Mode) => {
    if (!hasRendered[mode]) {
      setIsLoading(true);
      setHasRendered((prev) => ({ ...prev, [mode]: true }));
    }
    setTimeout(() => {
      setActiveMode(mode);
    }, 0);
  };

  const handleRefresh = () => {
    setIsSpinning(true);
    setRefresh(new Date().toISOString());
    Animated.timing(rotateValue, {
      toValue: 2,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      rotateValue.setValue(0);
    });
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const [hasRendered, setHasRendered] = useState<Record<Mode, boolean>>({
    day: true,
    week: false,
    month: false,
  });

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
        {/* Schedule Mode */}
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
          <View className="flex-1" />
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Pressable
              onPress={handleRefresh}
              disabled={isSpinning}
              className="items-center rounded-lg justify-center px-3"
            >
              <RepeatIcon color="#D6E8EE" />
            </Pressable>
          </Animated.View>
        </View>
        {/* Content */}
        <View className="flex-1">
          {hasRendered.day && (
            <View
              style={{
                display: activeMode === "day" ? "flex" : "none",
                flex: 1,
              }}
            >
              <DaySchedule
                refresh={refresh}
                date={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                  )
                }
              />
            </View>
          )}
          {hasRendered.week && (
            <View
              style={{
                display: activeMode === "week" ? "flex" : "none",
                flex: 1,
              }}
            >
              <WeekSchedule refresh={refresh} />
            </View>
          )}
          {hasRendered.month && (
            <View
              style={{
                display: activeMode === "month" ? "flex" : "none",
                flex: 1,
              }}
            >
              <MonthSchedule refresh={refresh} />
            </View>
          )}
          {isLoading && (
            <Loading
              className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center"
              innerClassName="rounded-lg p-5 bg-blackBlue/80 items-center justify-center"
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
