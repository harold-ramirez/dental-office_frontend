import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    date: new Date().toDateString(),
  });

  return (
    <Pressable
      onPress={onClose}
      className="absolute justify-center items-center bg-blackBlue/50 w-full h-full"
    >
      <Pressable
        onPress={() => {}}
        className="gap-2 bg-whiteBlue px-5 py-2 rounded-xl w-2/3"
      >
        <Text className="font-bold text-blackBlue text-2xl text-center">
          Registrar Cuota
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-blackBlue">Monto:</Text>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="123.50"
            className="flex-1 p-1 border border-blackBlue rounded-lg text-center"
          />
          <Text>Bs.</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-blackBlue">Fecha: </Text>
          <Pressable
            className="flex-1 h-8"
            onPress={() => setShowDatePicker(true)}
          >
            <TextInput
              className="flex-1 bg-whiteBlue p-1 border rounded-md text-center"
              value={
                newPayment.date
                  ? new Date(newPayment.date).toLocaleDateString("es-BO")
                  : ""
              }
              editable={false}
            />
          </Pressable>
        </View>
        <Pressable className="justify-center items-center bg-darkBlue active:bg-blackBlue mt-5 p-2 rounded-full">
          <Text className="font-semibold text-whiteBlue">Registrar</Text>
        </Pressable>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={
            newPayment.date ? new Date(newPayment.date) : new Date(2000, 6, 1)
          }
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setNewPayment({
                ...newPayment,
                date: selectedDate.toISOString(),
              });
            }
          }}
          minimumDate={new Date("1900-01-01")}
          maximumDate={new Date()}
        />
      )}
    </Pressable>
  );
}
