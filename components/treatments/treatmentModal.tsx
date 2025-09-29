import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import DropdownComponent from "../dropdown";

export default function TreatmentModal({ onClose }: { onClose: () => void }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    patient: "",
    treatment: "",
    dentalPieces: [],
    description: "",
    startDate: new Date().toDateString(),
    totalAmount: "",
  });
  const handleRegisterTreatment = () => {
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/75 w-full h-full"
    >
      <Pressable
        onPress={onClose}
        className="absolute justify-center items-center w-full h-full"
      >
        <Pressable
          onPress={() => {}}
          className="top-4 gap-3 bg-pureBlue -mt-28 px-3 py-5 border border-blackBlue rounded-xl w-11/12"
        >
          <LinearGradient
            colors={["#018ABE", "#02457A", "#018ABE"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
            }}
          />

          <View className="flex-row justify-between items-center gap-5">
            <Text className="font-bold text-whiteBlue">Paciente:</Text>
            <DropdownComponent
              className="w-3/5 h-8"
              data={[{ label: "Juan Perez", value: "1" }]}
            />
          </View>
          <View className="flex-row justify-between items-center gap-5">
            <Text className="font-bold text-whiteBlue">Tratamiento:</Text>
            <DropdownComponent
              className="w-3/5 h-8"
              data={[{ label: "Ortodoncia", value: "1" }]}
            />
          </View>
          <View className="flex-row justify-between items-center gap-5">
            <Text className="font-bold text-whiteBlue">
              Piezas{`\n`}Dentales:
            </Text>
            <DropdownComponent
              className="w-3/5 h-8"
              data={[{ label: "14", value: "14" }]}
            />
          </View>
          <View>
            <Text className="font-bold text-whiteBlue">Descripción:</Text>
            <TextInput
              className="bg-whiteBlue p-2 border rounded-lg h-32 text-lg"
              numberOfLines={10}
              value={newTreatment.description}
              onChangeText={(text) =>
                setNewTreatment({ ...newTreatment, description: text })
              }
              style={{ textAlignVertical: "top" }}
              multiline
            />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-whiteBlue text-center">
              Inicio{`\n`}Tratamiento:
            </Text>
            <DatePicker
              modal
              mode="date"
              open={showDatePicker}
              date={
                newTreatment.startDate
                  ? new Date(newTreatment.startDate)
                  : new Date(2000, 6, 1)
              }
              onConfirm={(date) => {
                setNewTreatment({
                  ...newTreatment,
                  startDate: date.toISOString(),
                });
                setShowDatePicker(false);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                className="bg-whiteBlue p-2 border rounded-md text-center"
                value={
                  newTreatment.startDate
                    ? new Date(newTreatment.startDate).toLocaleDateString(
                        "es-BO",
                        {
                          day: "numeric",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )
                    : ""
                }
                editable={false}
              />
            </Pressable>
            <Text className="font-bold text-whiteBlue text-center">
              Costo{`\n`}Total:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="123.50"
              placeholderTextColor={"gray"}
              value={newTreatment.totalAmount}
              onChangeText={(text) =>
                setNewTreatment({
                  ...newTreatment,
                  totalAmount: text,
                })
              }
              className="bg-whiteBlue p-2 border rounded-lg w-24 text-center"
            />
            <Text className="font-semibold text-whiteBlue">Bs.</Text>
          </View>
          <Pressable
            onPress={handleRegisterTreatment}
            className="justify-center items-center bg-blackBlue active:bg-darkBlue mt-5 p-1 border-2 border-whiteBlue rounded-full"
          >
            <Text className="font-bold text-whiteBlue text-lg">Registrar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
