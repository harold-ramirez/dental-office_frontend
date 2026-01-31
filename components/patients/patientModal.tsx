import { CreatePatientDto, PatientDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import GlassyBackground from "../glassyBackground";
import { EditIcon, SaveIcon, XIcon } from "../Icons";
import { GenderRadio } from "../radioButton";

interface CreatePatientProps {
  onClose: () => void;
}

interface UpdatePatientProps {
  onClose: (updated?: boolean) => void;
  patient: PatientDto;
}

export function CreatePatientModal({ onClose }: CreatePatientProps) {
  const router = useRouter();
  const { logOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPatient, setNewPatient] = useState<CreatePatientDto>({
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "M",
    cellphoneNumber: null,
    telephoneNumber: null,
    identityDocument: "",
    occupation: "",
    birthdate: "",
    placeOfBirth: "",
    address: "",
  });

  const handleRegisterPatient = async () => {
    if (newPatient.name && newPatient.gender) {
      setIsLoading(true);
      try {
        await fetchWithToken(
          "/patients",
          {
            method: "POST",
            body: JSON.stringify(newPatient),
          },
          logOut,
        );
        router.replace("/patients?refresh=1");
        Alert.alert(
          "Paciente Registrado",
          "El paciente ha sido registrado exitosamente",
          [{ text: "OK" }],
          { cancelable: true },
        );
        setNewPatient({
          name: "",
          paternalSurname: "",
          maternalSurname: "",
          gender: "",
          cellphoneNumber: "",
          occupation: "",
          birthdate: "",
          identityDocument: "",
          placeOfBirth: "",
          address: "",
        });
      } catch (error) {
        console.error("Error creating new patient:", error);
        Alert.alert(
          "Error",
          "Hubo un error al registrar el paciente. Por favor, intenta nuevamente.",
          [{ text: "OK" }],
        );
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000AA",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlassyBackground
        color1={"#018ABE"}
        color2={"#02457A"}
        className="border border-whiteBlue rounded-xl w-full"
      >
        <View className="gap-2 p-3">
          <Text className="font-bold text-whiteBlue text-center">
            INFORMACIÓN DEL PACIENTE
          </Text>
          <View className="flex-row gap-2 w-full">
            {/* Names */}
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">Nombres</Text>
              <TextInput
                value={newPatient.name}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, name: val })
                }
                placeholder="Nombres"
                placeholderTextColor={"gray"}
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            {/* IDENTITY DOCUMENT */}
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Carnet de Identidad
              </Text>
              <TextInput
                value={newPatient.identityDocument}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, identityDocument: val })
                }
                placeholder="CI"
                placeholderTextColor={"gray"}
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Apellido Paterno
              </Text>
              <TextInput
                placeholder="Apellido"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={45}
                value={newPatient.paternalSurname ?? ""}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, paternalSurname: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Apellido Materno
              </Text>
              <TextInput
                placeholder="Apellido"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={45}
                value={newPatient.maternalSurname ?? ""}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, maternalSurname: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">Sexo</Text>
              <GenderRadio
                value={newPatient.gender as "M" | "F"}
                onChange={(val) =>
                  setNewPatient({ ...newPatient, gender: val })
                }
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">Celular</Text>
              <TextInput
                placeholder="Teléfono"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                keyboardType="phone-pad"
                maxLength={15}
                value={newPatient.cellphoneNumber ?? ""}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, cellphoneNumber: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Ocupación
              </Text>
              <TextInput
                value={newPatient.occupation ?? ""}
                placeholder="Ocupación"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={50}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, occupation: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Fecha Nacimiento
              </Text>
              <DatePicker
                modal
                mode="date"
                open={showDatePicker}
                date={
                  newPatient.birthdate
                    ? new Date(newPatient.birthdate)
                    : new Date(2000, 6, 1)
                }
                onConfirm={(date) => {
                  setNewPatient({
                    ...newPatient,
                    birthdate: date.toISOString(),
                  });
                  setShowDatePicker(false);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
              <Pressable
                disabled={isLoading}
                onPress={() => setShowDatePicker(true)}
              >
                <TextInput
                  className="bg-whiteBlue p-1 border border-blackBlue rounded-xl w-full text-center"
                  placeholder="Selecciona fecha..."
                  placeholderTextColor="gray"
                  value={
                    newPatient.birthdate
                      ? new Date(newPatient.birthdate).toLocaleDateString(
                          "es-BO",
                        )
                      : ""
                  }
                  editable={false}
                />
              </Pressable>
              <Text className="mt-1 font-bold text-whiteBlue text-lg">
                Lugar Nacimiento
              </Text>
              <TextInput
                value={newPatient.placeOfBirth ?? ""}
                placeholder="Ciudad/País"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={50}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, placeOfBirth: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Dirección
              </Text>
              <TextInput
                multiline
                numberOfLines={2}
                style={{ textAlignVertical: "top" }}
                value={newPatient.address ?? ""}
                placeholder="Dirección completa"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                maxLength={100}
                onChangeText={(val) =>
                  setNewPatient({ ...newPatient, address: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full h-32"
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-around">
          <Pressable
            onPress={onClose}
            className="flex-row justify-center items-center gap-2 px-5 py-2 border-whiteBlue border-t rounded-bl-xl w-1/2"
          >
            <XIcon color="#D6E8EE" />
            <Text className="font-semibold text-whiteBlue">Cancelar</Text>
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
              className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-darkBlue px-5 py-2 border-whiteBlue border-t border-l rounded-br-xl w-1/2"
            >
              <SaveIcon color="#D6E8EE" />
              <Text className="font-semibold text-whiteBlue">Registrar</Text>
            </Pressable>
          )}
        </View>
      </GlassyBackground>
    </KeyboardAvoidingView>
  );
}

export function UpdatePatientModal({
  onClose,
  patient: initialPatient,
}: UpdatePatientProps) {
  const { logOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [patient, setPatient] = useState<PatientDto>({ ...initialPatient });

  const handleUpdatePatient = async () => {
    if (patient.name && patient.gender) {
      setIsLoading(true);
      let endpoint: Response | null = null;
      try {
        endpoint = await fetchWithToken(
          `/patients/${patient.Id}`,
          {
            method: "PATCH",
            body: JSON.stringify(patient),
          },
          logOut,
        );
        Alert.alert(
          "Datos Actualizado",
          "Los datos del paciente se han actualizado exitosamente.",
          [{ text: "OK" }],
          { cancelable: true },
        );
      } catch (error) {
        console.error("Error updating patient:", error);
        Alert.alert(
          "Error",
          "Hubo un error al actualizar los datos del paciente. Por favor, intenta nuevamente.",
          [{ text: "OK" }],
        );
      } finally {
        setIsLoading(false);
        onClose(endpoint?.ok);
      }
    } else {
      Alert.alert("Error", "Por favor, completa los campos obligatorios (*).", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000AA",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -40,
      }}
    >
      <GlassyBackground
        color1={"#018ABE"}
        color2={"#02457A"}
        className="border border-whiteBlue rounded-xl w-full"
      >
        <View className="gap-2 p-3">
          <Text className="font-bold text-whiteBlue text-xl text-center">
            INFORMACIÓN DEL PACIENTE
          </Text>
          <View>
            <Text className="font-bold text-whiteBlue text-lg">Nombres</Text>
            <TextInput
              value={patient.name}
              onChangeText={(val) => setPatient({ ...patient, name: val })}
              placeholder="Nombres"
              placeholderTextColor={"gray"}
              className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
            />
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Apellido Paterno
              </Text>
              <TextInput
                placeholder="Apellido"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={45}
                value={patient.paternalSurname ?? ""}
                onChangeText={(val) =>
                  setPatient({ ...patient, paternalSurname: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Apellido Materno
              </Text>
              <TextInput
                placeholder="Apellido"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={45}
                value={patient.maternalSurname ?? ""}
                onChangeText={(val) =>
                  setPatient({ ...patient, maternalSurname: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">Sexo</Text>
              <GenderRadio
                value={patient.gender as "M" | "F"}
                onChange={(val) => setPatient({ ...patient, gender: val })}
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">Celular</Text>
              <TextInput
                placeholder="Teléfono"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                keyboardType="phone-pad"
                maxLength={15}
                value={patient.cellphoneNumber ?? ""}
                onChangeText={(val) =>
                  setPatient({ ...patient, cellphoneNumber: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Ocupación
              </Text>
              <TextInput
                value={patient.occupation ?? ""}
                placeholder="Ocupación"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={50}
                onChangeText={(val) =>
                  setPatient({ ...patient, occupation: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Fecha Nacimiento
              </Text>
              <DatePicker
                modal
                mode="date"
                open={showDatePicker}
                date={
                  patient.birthdate
                    ? new Date(patient.birthdate)
                    : new Date(2000, 6, 1)
                }
                onConfirm={(date) => {
                  setPatient({
                    ...patient,
                    birthdate: date.toISOString(),
                  });
                  setShowDatePicker(false);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
              <Pressable
                disabled={isLoading}
                onPress={() => setShowDatePicker(true)}
              >
                <TextInput
                  className="bg-whiteBlue p-1 border border-blackBlue rounded-xl w-full text-center"
                  placeholder="Selecciona fecha..."
                  placeholderTextColor="gray"
                  value={
                    patient.birthdate
                      ? new Date(patient.birthdate).toLocaleDateString("es-BO")
                      : ""
                  }
                  editable={false}
                />
              </Pressable>
              <Text className="mt-1 font-bold text-whiteBlue text-lg">
                Lugar Nacimiento
              </Text>
              <TextInput
                value={patient.placeOfBirth ?? ""}
                placeholder="Ciudad/País"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                autoCapitalize="words"
                maxLength={50}
                onChangeText={(val) =>
                  setPatient({ ...patient, placeOfBirth: val })
                }
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-whiteBlue text-lg">
                Dirección
              </Text>
              <TextInput
                multiline
                numberOfLines={2}
                style={{ textAlignVertical: "top" }}
                value={patient.address ?? ""}
                placeholder="Dirección completa"
                placeholderTextColor={"gray"}
                readOnly={isLoading}
                maxLength={100}
                onChangeText={(val) => setPatient({ ...patient, address: val })}
                className="bg-whiteBlue border border-blackBlue rounded-xl w-full h-32"
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-around">
          <Pressable
            onPress={() => onClose(false)}
            className="flex-row justify-center items-center gap-2 px-5 py-2 border-whiteBlue border-t rounded-bl-xl w-1/2"
          >
            <XIcon color="#D6E8EE" />
            <Text className="font-semibold text-whiteBlue">Cancelar</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator
              color={"#fff"}
              size={"small"}
              className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-darkBlue px-5 py-2 border border-blackBlue rounded-br-lg w-1/2"
            />
          ) : (
            <Pressable
              onPress={handleUpdatePatient}
              className="flex-row justify-center items-center gap-2 bg-blackBlue active:bg-darkBlue px-5 py-2 border-whiteBlue border-t border-l rounded-br-xl w-1/2"
            >
              <EditIcon color="#D6E8EE" />
              <Text className="font-semibold text-whiteBlue">Actualizar</Text>
            </Pressable>
          )}
        </View>
      </GlassyBackground>
    </KeyboardAvoidingView>
  );
}
