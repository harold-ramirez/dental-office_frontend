import { CreatePatient } from "@/interfaces/interfaces";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SaveIcon, XIcon } from "../Icons";

export default function NewPatient({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPatient, setNewPatient] = useState<CreatePatient>({
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "",
    phoneNumber: "",
    occupation: "",
    birthdate: "",
    placeOfBirth: "",
    address: "",
    AppUser_Id: 1,
  });

  const handleRegisterPatient = async () => {
    if (newPatient.name && newPatient.gender) {
      setIsLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      try {
        const endpoint = await fetch(`${apiUrl}/patients`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPatient),
        });
        if (endpoint.ok) {
          router.replace("/patients?refresh=1");
          Alert.alert(
            "Paciente Registrado",
            "El paciente ha sido registrado exitosamente",
            [{ text: "OK" }],
            { cancelable: true }
          );
          setNewPatient({
            name: "",
            paternalSurname: "",
            maternalSurname: "",
            gender: "",
            phoneNumber: "",
            occupation: "",
            birthdate: "",
            placeOfBirth: "",
            address: "",
            AppUser_Id: 1,
          });
        } else {
          Alert.alert(
            "Error",
            "Hubo un error al registrar el paciente. Por favor, intenta nuevamente.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Error creating new patient:", error);
      } finally {
        setIsLoading(false);
        onClose();
      }
    } else {
      Alert.alert("Error", "Por favor, completa los campos obligatorios (*).", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View className="absolute justify-center items-center bg-black/75 w-full h-full">
      <View className="flex-col rounded-xl w-5/6">
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

        <View className="flex-col p-5">
          <View className="flex-row items-center gap-1 mb-3">
            <Text className="font-semibold text-whiteBlue">*Nombres:</Text>
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              value={newPatient.name}
              readOnly={isLoading}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, name: text })
              }
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
              readOnly={isLoading}
              value={newPatient.paternalSurname ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, paternalSurname: text })
              }
            />
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="Apellido"
              readOnly={isLoading}
              value={newPatient.maternalSurname ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, maternalSurname: text })
              }
            />
          </View>
          <View className="flex-row items-center">
            <Text className="w-1/3 font-semibold text-whiteBlue">*Sexo:</Text>
            <Text className="w-1/3 font-semibold text-whiteBlue">Celular:</Text>
            <Text className="w-1/3 font-semibold text-whiteBlue">
              Ocupación:
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-3">
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="M/F"
              readOnly={isLoading}
              value={newPatient.gender}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, gender: text })
              }
            />
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="Teléfono"
              readOnly={isLoading}
              keyboardType="phone-pad"
              value={newPatient.phoneNumber ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, phoneNumber: text })
              }
            />
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="Ocupación"
              readOnly={isLoading}
              value={newPatient.occupation ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, occupation: text })
              }
            />
          </View>
          <View className="flex-row">
            <Text className="w-1/2 font-semibold text-whiteBlue">
              *Fecha de Nacimiento:
            </Text>
            <Text className="w-1/2 font-semibold text-whiteBlue">
              *Lugar de Nacimiento:
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-3">
            <Pressable
              className="flex-1"
              disabled={isLoading}
              onPress={() => setShowDatePicker(true)}
            >
              <TextInput
                className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
                placeholder="Selecciona fecha..."
                value={
                  newPatient.birthdate
                    ? new Date(newPatient.birthdate).toLocaleDateString("es-ES")
                    : ""
                }
                editable={false}
              />
            </Pressable>
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md text-center"
              placeholder="Ciudad/País"
              readOnly={isLoading}
              value={newPatient.placeOfBirth ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, placeOfBirth: text })
              }
            />
          </View>
          <View className="flex-row">
            <Text className="font-semibold text-whiteBlue">Dirección:</Text>
          </View>
          <View className="flex-row mb-3">
            <TextInput
              className="flex-1 bg-whiteBlue p-1 rounded-md h-16"
              placeholder="Dirección completa"
              readOnly={isLoading}
              value={newPatient.address ?? ""}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, address: text })
              }
              multiline={true}
              style={{ textAlignVertical: "top" }}
            />
          </View>
        </View>

        <View className="flex-row justify-around">
          <Pressable
            onPress={onClose}
            className="flex-row justify-center items-center gap-2 bg-lightBlue active:bg-pureBlue px-5 py-2 border border-blackBlue rounded-bl-lg w-1/2"
          >
            <XIcon color="#001B48" />
            <Text className="font-semibold text-blackBlue">Cancelar</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator
              color={"#fff"}
              size={"small"}
              className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-darkBlue px-5 py-2 border border-blackBlue rounded-br-lg w-1/2"
            />
          ) : (
            <Pressable
              onPress={handleRegisterPatient}
              className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-darkBlue px-5 py-2 border border-blackBlue rounded-br-lg w-1/2"
            >
              <SaveIcon color="#D6E8EE" />
              <Text className="font-semibold text-whiteBlue">Registrar</Text>
            </Pressable>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={
              newPatient.birthdate
                ? new Date(newPatient.birthdate)
                : new Date(2000, 6, 1)
            }
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
            minimumDate={new Date("1900-01-01")}
            maximumDate={new Date()}
          />
        )}
      </View>
    </View>
  );
}
