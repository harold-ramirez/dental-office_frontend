import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";

interface Props {
  onClose: () => void;
  onRefresh: () => void;
  procedureId: number;
}

export default function PaymentModal(props: Props) {
  const { onClose, procedureId, onRefresh } = props;
  const { logOut } = useContext(AuthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPayment, setNewPayment] = useState<{
    amount: number | "";
    DiagnosedProcedure_Id: number;
    registerDate: string;
  }>({
    amount: "",
    DiagnosedProcedure_Id: procedureId,
    registerDate: new Date().toISOString(),
  });

  const handlePostPayment = async () => {
    if (newPayment.amount === "") return;
    try {
      const res = await fetchWithToken(
        "/payments",
        {
          method: "POST",
          body: JSON.stringify({
            amount: newPayment.amount,
            DiagnosedProcedure_Id: procedureId,
            registerDate: newPayment.registerDate,
          }),
        },
        logOut,
      );
      if (res.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.log("Error posting Payment:", error);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [onClose]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/75 w-full h-full"
    >
      <View className="absolute justify-center items-center bg-blackBlue/50 w-full h-full">
        <View className="gap-2 bg-whiteBlue px-5 py-2 rounded-xl w-2/3">
          <Text className="font-bold text-blackBlue text-2xl text-center">
            Registrar Cuota
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-blackBlue">Monto:</Text>
            <TextInput
              keyboardType="decimal-pad"
              value={newPayment.amount.toString()}
              placeholderTextColor={"gray"}
              onChangeText={(text) =>
                setNewPayment({ ...newPayment, amount: +text })
              }
              placeholder="123.50"
              className="flex-1 p-1 border border-blackBlue rounded-lg text-center"
            />
            <Text>Bs.</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-blackBlue">Fecha: </Text>
            <DatePicker
              modal
              mode="date"
              open={showDatePicker}
              date={
                newPayment.registerDate
                  ? new Date(newPayment.registerDate)
                  : new Date(2000, 6, 1)
              }
              onConfirm={(date) => {
                setNewPayment({
                  ...newPayment,
                  registerDate: date.toISOString(),
                });
                setShowDatePicker(false);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />
            <Pressable
              className="flex-1 h-8"
              onPress={() => setShowDatePicker(true)}
            >
              <TextInput
                className="flex-1 bg-whiteBlue p-1 border rounded-md text-center"
                value={
                  newPayment.registerDate
                    ? new Date(newPayment.registerDate).toLocaleDateString(
                        "es-BO",
                      )
                    : ""
                }
                editable={false}
              />
            </Pressable>
          </View>
          <Pressable
            onPress={() => handlePostPayment()}
            className="justify-center items-center bg-darkBlue active:bg-blackBlue mt-5 p-2 rounded-full"
          >
            <Text className="font-semibold text-whiteBlue">Registrar</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
