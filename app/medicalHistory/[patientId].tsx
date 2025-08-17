import { PlusIcon } from "@/components/Icons";
import OptionalTextInput from "@/components/optionalTextInput";
import { GenderRadio, YesNoRadio } from "@/components/radioButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicalHistory() {
  const { patientId } = useLocalSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    age: "",
    gender: "M",
    phoneNumber: "",
    occupation: "",
    birthdate: "",
    placeOfBirth: "",
    address: "",
    personalPathologieshistory: [],
    habits: [],
    allergies: "",
    isPregnant: "",
    isInMedicalTreatment: "",
    isTakingMedicine: "",
    hadHemorrhageAfterExtraction: "",
    breathing: "",
    teethBrushFrecuency: "",
    intraoralProsthesis: "",
    usesDentalFloss: "N",
    usesMouthWash: "N",
    hasBleedingGums: "N",
    oralStatus: "",
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute bg-black/75 w-full h-full"
    >
      <LinearGradient
        colors={["#001B48", "#018ABE", "#001B48"]}
        className="top-0 right-0 left-0 absolute h-full"
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 8,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "Historia Clínica Odontológica",
            headerRight: () => <></>,
          }}
        />
        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          <View className="gap-5 pb-5">
            {/* PATIENT'S INFORMATION */}
            <LinearGradient
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
              }}
            >
              <Text className="font-bold text-whiteBlue text-center">
                INFORMACIÓN DEL PACIENTE
              </Text>
              <View>
                <Text className="font-bold text-whiteBlue text-lg">
                  Nombres
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(val) =>
                    setFormData({ ...formData, name: val })
                  }
                  className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                />
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">
                    Apellido Paterno
                  </Text>
                  <TextInput
                    value={formData.paternalSurname}
                    onChangeText={(val) =>
                      setFormData({ ...formData, paternalSurname: val })
                    }
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">
                    Apellido Materno
                  </Text>
                  <TextInput
                    value={formData.maternalSurname}
                    onChangeText={(val) =>
                      setFormData({ ...formData, maternalSurname: val })
                    }
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                  />
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">Edad</Text>
                  <TextInput
                    value={formData.age}
                    editable={false}
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">Sexo</Text>
                  <GenderRadio
                    value={formData.gender as "M" | "F"}
                    onChange={(val) =>
                      setFormData({ ...formData, gender: val })
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">
                    Celular
                  </Text>
                  <TextInput
                    keyboardType="phone-pad"
                    maxLength={8}
                    value={formData.phoneNumber}
                    onChangeText={(val) =>
                      setFormData({ ...formData, phoneNumber: val })
                    }
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-whiteBlue text-lg">
                    Ocupación
                  </Text>
                  <TextInput
                    value={formData.occupation}
                    onChangeText={(val) =>
                      setFormData({ ...formData, occupation: val })
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
                  <Pressable onPress={() => setShowDatePicker(true)}>
                    <TextInput
                      className="bg-whiteBlue border p-1 border-blackBlue rounded-xl w-full text-center"
                      placeholder="Selecciona fecha..."
                      value={
                        formData.birthdate
                          ? new Date(formData.birthdate).toLocaleDateString(
                              "es-BO"
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
                    value={formData.placeOfBirth}
                    onChangeText={(val) =>
                      setFormData({ ...formData, placeOfBirth: val })
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
                    value={formData.address}
                    onChangeText={(val) =>
                      setFormData({ ...formData, address: val })
                    }
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full h-32"
                  />
                </View>
              </View>
            </LinearGradient>

            {/* PATIENT'S PATHOLOGIES */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              style={{
                borderRadius: 12,
              }}
            >
              <View>
                <Text className="font-bold text-whiteBlue text-lg">
                  Antecedentes Patológicos Familiares
                </Text>
                <TextInput className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center" />
              </View>
              <View>
                <Text className="font-bold text-whiteBlue text-lg">
                  Antecedentes Patológicos Familiares
                </Text>
                <View className="bg-whiteBlue p-2 rounded-xl gap-5">
                  <View className="flex-row flex-1 flex-wrap gap-2 justify-around">
                    {/* Renderizar como componente con un .map() */}
                    <Pressable className="justify-center items-center bg-whiteBlue px-5 border-2 border-blackBlue rounded-full">
                      <Text className="font-semibold text-blackBlue">
                        Anemia
                      </Text>
                    </Pressable>
                    {/*  */}
                  </View>
                  <View className="items-end">
                    <Pressable className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4">
                      <PlusIcon size={24} color="#D6E8EE" />
                      <Text className="text-whiteBlue">Otro</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="flex-1 font-semibold text-whiteBlue">
                  Alergias
                </Text>
                <OptionalTextInput
                  placeholder="Ej. Maní"
                  value={formData.allergies}
                  setValue={(val) =>
                    setFormData({ ...formData, allergies: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="flex-1 font-semibold text-whiteBlue">
                  Embarazo
                </Text>
                <OptionalTextInput
                  placeholder="Ej. 3 Meses"
                  value={formData.isPregnant}
                  setValue={(val) =>
                    setFormData({ ...formData, isPregnant: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="flex-1 font-semibold text-whiteBlue">
                  Está en Tratamiento Médico?
                </Text>
                <OptionalTextInput
                  placeholder="Ej. ..."
                  value={formData.isInMedicalTreatment}
                  setValue={(val) =>
                    setFormData({ ...formData, isInMedicalTreatment: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="flex-1 font-semibold text-whiteBlue">
                  Actualmente recibe algún medicamento?
                </Text>
                <OptionalTextInput
                  placeholder="Ej. Aspirina"
                  value={formData.isTakingMedicine}
                  setValue={(val) =>
                    setFormData({ ...formData, isTakingMedicine: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="flex-1 font-semibold text-whiteBlue">
                  Tuvo hemorragia después de una extracción dental?
                </Text>
                <OptionalTextInput
                  placeholder="Ej. Inmediata"
                  className=""
                  value={formData.hadHemorrhageAfterExtraction}
                  setValue={(val) =>
                    setFormData({
                      ...formData,
                      hadHemorrhageAfterExtraction: val,
                    })
                  }
                />
              </View>
            </LinearGradient>

            {/* INTRAORAL EXAMINATION */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              style={{
                borderRadius: 12,
              }}
            >
              <Text className="font-bold text-whiteBlue text-center">
                EXAMEN INTRAORAL
              </Text>
              <View>
                <Text className="font-semibold text-whiteBlue">ATM</Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">
                  Ganglios Linfáticos
                </Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">
                  Respiración
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, breathing: "Nasal" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.breathing === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.breathing === "Nasal"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.breathing === "Nasal"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Nasal
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, breathing: "Mouth" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.breathing === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.breathing === "Mouth"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.breathing === "Mouth"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Bucal
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, breathing: "Oral-Nasal" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.breathing === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.breathing === "Oral-Nasal"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.breathing === "Oral-Nasal"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Buconasal
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">Otros</Text>
                <TextInput
                  multiline
                  numberOfLines={5}
                  className="bg-whiteBlue p-2 rounded-xl h-24"
                  style={{ textAlignVertical: "top" }}
                />
              </View>
            </LinearGradient>

            {/* INTRAORAL EXAMINATION */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              style={{
                borderRadius: 12,
              }}
            >
              <Text className="font-bold text-whiteBlue text-center">
                EXAMEN INTRAORAL
              </Text>
              <View>
                <Text className="font-semibold text-whiteBlue">Labios</Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">Lengua</Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">Paladar</Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">
                  Piso de la Boca
                </Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">
                  Mucosa Yugal
                </Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">Encías</Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View className="flex-row justify-between gap-3">
                <Text className="font-semibold text-whiteBlue">
                  Utiliza Prótesis intraoral?
                </Text>
                <OptionalTextInput
                  placeholder="..."
                  value={formData.intraoralProsthesis}
                  setValue={(val) =>
                    setFormData({ ...formData, intraoralProsthesis: val })
                  }
                />
              </View>
            </LinearGradient>

            {/* PATIENT'S ORAL HISTORY */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              style={{
                borderRadius: 12,
              }}
            >
              <Text className="font-bold text-whiteBlue text-center">
                ANTECEDENTES BUCODENTALES
              </Text>
              <View>
                <Text className="font-semibold text-whiteBlue">
                  Fecha de la última vez que visitó al odontólogo
                </Text>
                <TextInput className="bg-whiteBlue rounded-xl text-center" />
              </View>
              <View>
                <Text className="font-semibold text-whiteBlue">Hábitos</Text>
                <View className="bg-whiteBlue p-2 rounded-xl">
                  <View className="flex-row flex-1">
                    {/* Renderizar como componente con un .map() */}
                    <Pressable className="justify-center items-center bg-whiteBlue px-5 border-2 border-blackBlue rounded-full">
                      <Text className="font-semibold text-blackBlue">Fuma</Text>
                    </Pressable>
                    {/*  */}
                  </View>
                  <View className="items-end">
                    <Pressable className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4">
                      <PlusIcon size={24} color="#D6E8EE" />
                      <Text className="text-whiteBlue">Otro</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* ORAL HYGIENE HISTORY */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2 blur-xl p-3 border border-whiteBlue/30 rounded-xl w-full"
              style={{
                borderRadius: 12,
              }}
            >
              <Text className="font-bold text-whiteBlue text-center">
                ANTECEDENTES DE HIGIENE BUCAL
              </Text>
              <View className="flex-row justify-between items-center gap-3">
                <Text className="font-semibold text-whiteBlue">
                  Utiliza cepillo dental?
                </Text>
                <OptionalTextInput
                  placeholder="Frecuencia"
                  value={formData.teethBrushFrecuency}
                  setValue={(val) =>
                    setFormData({ ...formData, teethBrushFrecuency: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold text-whiteBlue">
                  Utiliza hilo dental?
                </Text>
                <YesNoRadio
                  value={formData.usesDentalFloss as "Y" | "N"}
                  onChange={(val) =>
                    setFormData({ ...formData, usesDentalFloss: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold text-whiteBlue">
                  Utiliza enjuague bucal?
                </Text>
                <YesNoRadio
                  value={formData.usesMouthWash as "Y" | "N"}
                  onChange={(val) =>
                    setFormData({ ...formData, usesMouthWash: val })
                  }
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold text-whiteBlue">
                  Durante el cepillado dental,{`\n`}le sangran las encías?
                </Text>
                <YesNoRadio
                  value={formData.hasBleedingGums as "Y" | "N"}
                  onChange={(val) =>
                    setFormData({ ...formData, hasBleedingGums: val })
                  }
                />
              </View>
              <View className="gap-2">
                <Text className="font-semibold text-whiteBlue">
                  Higiene Bucodental
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, oralStatus: "Good" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.oralStatus === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.oralStatus === "Good"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.oralStatus === "Good"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Buena
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, oralStatus: "Regular" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.oralStatus === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.oralStatus === "Regular"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.oralStatus === "Regular"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Regular
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setFormData({ ...formData, oralStatus: "Bad" })
                    }
                    className={`items-center py-1 border-2 rounded-full flex-1 ${
                      formData.oralStatus === ""
                        ? `bg-whiteBlue border-blackBlue`
                        : formData.oralStatus === "Bad"
                        ? `bg-blackBlue border-whiteBlue`
                        : `bg-whiteBlue/30 border-blackBlue`
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.oralStatus === "Bad"
                          ? `text-whiteBlue`
                          : `text-blackBlue`
                      }`}
                    >
                      Mala
                    </Text>
                  </Pressable>
                </View>
              </View>
            </LinearGradient>

            {/* SAVE BUTTON */}
            <View className="items-center">
              <Pressable className="items-center bg-blackBlue active:bg-pureBlue p-2 border border-whiteBlue rounded-full w-2/3">
                <Text className="font-bold text-whiteBlue text-xl">
                  Guardar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        
        {showDatePicker && (
          <DateTimePicker
            value={
              formData.birthdate
                ? new Date(formData.birthdate)
                : new Date(2000, 6, 1)
            }
            mode="date"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFormData({
                  ...formData,
                  birthdate: selectedDate.toISOString(),
                });
              }
            }}
            minimumDate={new Date("1900-01-01")}
            maximumDate={new Date()}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
