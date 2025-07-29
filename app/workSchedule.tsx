import { WorkScheduleSelection } from "@/components/appointments-requests/scheduleModes";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkSchedule() {
  return (
    <>
      <LinearGradient
        colors={["#97CADB", "#02457A", "#018ABE"]}
        className="top-0 right-0 bottom-0 left-0 absolute"
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 12,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "HORARIO DE ATENCIÓN",
            headerTitleStyle: {
              fontSize: 18,
            },
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-center bg-whiteBlue rounded-xl w-full">
          <View className="flex-row justify-end gap-5 my-2 px-2 w-full">
            <View className="flex-row items-center gap-1">
              <View className="bg-darkBlue size-5" />
              <Text className="italic">Abierto</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="bg-lightBlue size-5" />
              <Text className="italic">Cerrado</Text>
            </View>
          </View>
          <View className="flex-1">
            <WorkScheduleSelection />
          </View>
          <Pressable className="items-center bg-blackBlue active:bg-darkBlue my-2 py-2 rounded-full w-3/4">
            <Text className="font-semibold text-whiteBlue text-lg">
              Guardar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
