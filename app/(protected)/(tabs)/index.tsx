import AnimatedArc from "@/components/animatedArc";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
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
              number={999}
              text={`Citas Programadas ${`\n`} para el día de hoy`}
              duration={1000}
              delay={250}
            />

            {/* Content */}
            <View className="flex-1 gap-2 bg-whiteBlue p-2 rounded-2xl w-full">
              <View className="flex-row justify-between items-center w-full">
                <Text className="font-bold text-blackBlue text-lg">
                  Horario del día
                </Text>
                <Link href={"/createAppointment/[selectedDate]"} asChild>
                  <Pressable className="bg-pureBlue px-5 py-2 rounded-md">
                    <Text className="font-semibold text-whiteBlue text-center">
                      Agendar Cita
                    </Text>
                  </Pressable>
                </Link>
              </View>
              <View className="bg-lightBlue rounded-md w-full h-8"></View>
              <Link href={"/workSchedule"} asChild>
                <Pressable
                  android_ripple={{ color: "#02457A" }}
                  className="bg-pureBlue px-3 py-2 rounded-full"
                >
                  <Text className="font-semibold text-whiteBlue text-center">
                    Configurar Horario de Trabajo
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
