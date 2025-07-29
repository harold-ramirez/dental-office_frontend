import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <LinearGradient
        colors={["#02457A", "#97CADB"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 16, gap: 12 }}
      >
        <Text className="font-bold text-white text-3xl">
          Mi Consultorio Dental
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-2 bg-whiteBlue p-2 rounded-xl">
            <View className="flex-row justify-center items-center gap-2">
              <Link href={"/createAppointment/[selectedDate]"} asChild>
                <Pressable className="bg-darkBlue px-3 py-2 border-2 border-blackBlue rounded-full">
                  <Text className="font-semibold text-whiteBlue text-center">
                    Agendar{`\n`}Cita Médica
                  </Text>
                </Pressable>
              </Link>
              <Link href={"/workSchedule"} asChild>
                <Pressable className="bg-darkBlue px-3 py-2 border-2 border-blackBlue rounded-full">
                  <Text className="font-semibold text-whiteBlue text-center">
                    Configurar Horario{`\n`}de Trabajo
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
