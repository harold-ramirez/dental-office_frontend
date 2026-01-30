import AnimatedArc from "@/components/animatedArc";
import { ClockIcon, ScheduleIcon } from "@/components/Icons";
import { Summary, WeekSummary } from "@/components/summaries";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { logOut } = useContext(AuthContext);
  const [summary, setSummary] = useState<{
    today: number;
    tomorrow: number;
    currentWeek: number;
    currentWeekByDay: number[];
    pendingRequests: number;
  }>({
    today: 0,
    tomorrow: 0,
    currentWeek: 0,
    currentWeekByDay: [],
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchAppointmentsSummary = async () => {
      try {
        const data = await fetchWithToken(
          "/appointments/summary",
          { method: "GET" },
          logOut,
        );
        setSummary(data);
      } catch (e) {
        console.error("Error getting appointments summary:", e);
      }
    };

    fetchAppointmentsSummary();
  }, [logOut]);

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <LinearGradient
        colors={["#018ABE", "#001B48"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}
      >
        <Text className="my-2 font-bold text-white text-3xl">
          Mi Consultorio Dental
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 items-center gap-3 w-full">
            {/* Banner */}
            <AnimatedArc
              number={summary.today}
              text={`Cita${summary.today !== 1 ? `s` : ``} Programada${
                summary.today !== 1 ? `s` : ``
              } ${`\n`} para el día de hoy`}
              duration={1000}
              delay={250}
            />

            {/* Content */}
            <View className="flex-1 items-center gap-3 bg-whiteBlue p-3 rounded-t-2xl w-full">
              <WeekSummary weekSummary={summary.currentWeekByDay} />
              <Summary
                tomorrow={summary.tomorrow}
                currentWeek={summary.currentWeek}
                pendingRequests={summary.pendingRequests}
              />
              {/* Buttons */}
              <View className="flex-row gap-3">
                <Link href={"/workSchedule"} asChild>
                  <Pressable className="flex-1 justify-around items-center bg-pureBlue active:bg-darkBlue px-5 py-2 rounded-lg">
                    <ClockIcon color="#D6E8EE" size={40} />
                    <Text className="font-semibold text-whiteBlue text-center">
                      Configurar Horario
                    </Text>
                  </Pressable>
                </Link>
                <Link
                  href={{
                    pathname: "/(protected)/createAppointment/[selectedDate]",
                    params: { selectedDate: new Date().toISOString() },
                  }}
                  asChild
                >
                  <Pressable className="flex-1 justify-around items-center bg-pureBlue active:bg-darkBlue px-5 py-2 rounded-lg">
                    <ScheduleIcon color="#D6E8EE" size={48} />
                    <Text className="font-semibold text-whiteBlue text-center">
                      Agendar Cita
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
