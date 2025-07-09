import { Patient } from "@/interfaces/interfaces";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SaveIcon, XIcon } from "../Icons";

export default function NewPatient({ onClose }: { onClose: () => void }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPatient, setNewPatient] = useState<Patient>({} as Patient);

  return (
    <View className="absolute justify-center items-center bg-black/75 w-full h-full">
      <View className="flex-col p-5 rounded-xl w-5/6">
        <LinearGradient
          colors={["#018ABE", "#02457A", "#018ABE"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 10,
          }}
        />

        <View className="flex-row items-center gap-1 mb-3">
          <Text className="font-semibold text-whiteBlue">Nombres:</Text>
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Nombre"
          />
        </View>
        <View className="flex-row items-center">
          <Text className="w-1/2 font-semibold text-whiteBlue">
            Apellido Paterno:
          </Text>
          <Text className="w-1/2 font-semibold text-whiteBlue">
            Apellido Materno:
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mb-3">
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Apellido"
          />
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Apellido"
          />
        </View>
        <View className="flex-row items-center">
          <Text className="w-1/3 font-semibold text-whiteBlue">Sexo:</Text>
          <Text className="w-1/3 font-semibold text-whiteBlue">Celular:</Text>
          <Text className="w-1/3 font-semibold text-whiteBlue">Ocupación:</Text>
        </View>
        <View className="flex-row items-center gap-2 mb-3">
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="M/F"
          />
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Ocupación"
          />
        </View>
        <View className="flex-row">
          <Text className="w-1/2 font-semibold text-whiteBlue">
            Fecha de Nacimiento:
          </Text>
          <Text className="w-1/2 font-semibold text-whiteBlue">
            Lugar de Nacimiento:
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mb-3">
          <Pressable className="flex-1" onPress={() => setShowDatePicker(true)}>
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="Selecciona fecha..."
              value={
                newPatient.birthdate
                  ? new Date(newPatient.birthdate).toLocaleDateString()
                  : ""
              }
              editable={false}
            />
          </Pressable>
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
            placeholder="Ciudad/País"
          />
        </View>
        <View className="flex-row">
          <Text className="font-semibold text-whiteBlue">Dirección:</Text>
        </View>
        <View className="flex-row mb-3">
          <TextInput
            className="flex-1 bg-whiteBlue p-1 rounded-md h-16"
            placeholder="Dirección completa"
            multiline={true}
            style={{ textAlignVertical: "top" }}
          />
        </View>

        <View className="flex-row justify-around mt-5">
          <Pressable
            onPress={onClose}
            className="flex-row items-center gap-2 bg-lightBlue active:bg-whiteBlue px-5 py-2 border-2 border-blackBlue rounded-lg"
          >
            <XIcon color="#001B48" />
            <Text className="font-semibold text-blackBlue">Cancelar</Text>
          </Pressable>
          <Pressable className="flex-row items-center gap-2 bg-blackBlue active:bg-pureBlue px-5 py-2 border-2 border-whiteBlue rounded-lg">
            <SaveIcon color="#D6E8EE" />
            <Text className="font-semibold text-whiteBlue">Registrar</Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setNewPatient({
                  ...newPatient,
                  birthdate: selectedDate.toISOString(),
                });
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </View>
    </View>
  );
}
