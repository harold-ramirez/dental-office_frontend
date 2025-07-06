import { AddPatientIcon, SearchIcon } from "@/components/Icons";
import PatientCard from "@/components/patients/patientCard";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Patients() {
  return (
    <>
      <LinearGradient
        colors={["#001B48", "#018ABE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 4 }}
      >
        <View className="flex-1 items-center gap-3">
          <Text className="font-bold text-white text-3xl">Mis Pacientes</Text>
          <View className="flex-row items-center bg-whiteBlue pl-2 rounded-lg w-full h-12 text-lg">
            <SearchIcon color="gray" size={30} />
            <TextInput
              placeholder="Buscar..."
              className="flex-1 p-2 h-full text-xl"
            />
          </View>
          <Pressable className="flex-row justify-center items-center bg-blackBlue px-5 py-2 rounded-full">
            <AddPatientIcon color="white" />
            <Text className="text-white">Nuevo Paciente</Text>
          </Pressable>
          <PatientCard />
        </View>
      </SafeAreaView>
    </>
  );
}
