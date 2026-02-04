import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { ADULT_TOOTH_PIECES, CHILD_TOOTH_PIECES } from "@/utils/teethPieces";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DropdownComponent from "../dropdown";

interface Props {
  patientId: number;
  onClose: () => void;
}

export default function TreatmentModal(props: Props) {
  const { patientId = 0, onClose } = props;
  const { logOut } = useContext(AuthContext);
  const [teethAge, setTeethAge] = useState<"Adulto" | "Niño">("Adulto");
  const [formData, setFormData] = useState<{
    description: string;
    totalCost: number | "";
    Treatment_Id: number;
    dentalPieces: number[];
  }>({
    description: "",
    totalCost: "",
    Treatment_Id: 0,
    dentalPieces: [],
  });
  const [treatmentList, setTreatmentList] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchTreatmentList = useCallback(async () => {
    try {
      const data: { Id: number; name: string }[] = await fetchWithToken(
        "/treatments",
        { method: "GET" },
        logOut,
      );
      const parsed: { label: string; value: string }[] = [];
      data.map((treatment) => {
        parsed.push({
          label: treatment.name,
          value: treatment.Id.toString(),
        });
      });
      setTreatmentList(parsed);
    } catch (error) {
      console.log("Error fetching Treatments or Teeth:", error);
    }
  }, [logOut]);

  useEffect(() => {
    fetchTreatmentList();
  }, [fetchTreatmentList]);

  const handleRegisterTreatment = async () => {
    if (formData.Treatment_Id === 0) return;
    try {
      const res = await fetchWithToken(
        "/diagnosed-procedure",
        {
          method: "POST",
          body: JSON.stringify({
            description:
              formData.description === "" ? null : formData.description,
            totalCost: formData.totalCost === "" ? null : formData.totalCost,
            Patient_Id: patientId,
            Treatment_Id: formData.Treatment_Id,
            dentalPieces: formData.dentalPieces.sort((a, b) => a - b).join("-"),
          }),
        },
        logOut,
      );
      router.replace({
        pathname: "/(protected)/treatmentDetails/[treatmentId]",
        params: {
          treatmentId: res.Id.toString(),
        },
      });
      onClose();
    } catch (error) {
      console.log("Error posting Treatment:", error);
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
      <View className="absolute justify-center items-center w-full h-full">
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
          {/* Treatment Picker */}
          <View className="flex-row justify-between items-center gap-5">
            <Text className="font-bold text-whiteBlue">Tratamiento:</Text>
            <DropdownComponent
              className="w-3/5 h-8"
              data={treatmentList}
              value={formData.Treatment_Id.toString()}
              setValue={(val) => {
                setFormData({ ...formData, Treatment_Id: +val });
              }}
            />
          </View>
          {/* Dental Pieces */}
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-whiteBlue">Piezas Dentales:</Text>
            <Pressable
              onPress={() =>
                setTeethAge(teethAge === "Adulto" ? "Niño" : "Adulto")
              }
              className="bg-darkBlue active:bg-pureBlue px-4 py-1 border border-whiteBlue rounded-full"
            >
              <Text className="text-whiteBlue">{teethAge}</Text>
            </Pressable>
          </View>
          <View className="flex-row bg-whiteBlue px-2 py-4 rounded-md w-full">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="w-full"
            >
              <View>
                <ToothButton
                  adultStartWith="1"
                  childStartWith="5"
                  formData={formData}
                  isUpper
                  teeth={
                    teethAge === "Adulto"
                      ? [...ADULT_TOOTH_PIECES].reverse()
                      : [...CHILD_TOOTH_PIECES].reverse()
                  }
                  setFormData={setFormData}
                />
                <View className="my-2 border border-blackBlue rounded-full w-full" />
                <ToothButton
                  adultStartWith="4"
                  childStartWith="8"
                  formData={formData}
                  teeth={
                    teethAge === "Adulto"
                      ? [...ADULT_TOOTH_PIECES].reverse()
                      : [...CHILD_TOOTH_PIECES].reverse()
                  }
                  setFormData={setFormData}
                />
              </View>
              <View className="border border-blackBlue rounded-full h-full" />
              <View>
                <ToothButton
                  adultStartWith="2"
                  childStartWith="6"
                  formData={formData}
                  isUpper
                  teeth={
                    teethAge === "Adulto"
                      ? ADULT_TOOTH_PIECES
                      : CHILD_TOOTH_PIECES
                  }
                  setFormData={setFormData}
                />
                <View className="my-2 border border-blackBlue rounded-full w-full" />
                <ToothButton
                  adultStartWith="3"
                  childStartWith="7"
                  formData={formData}
                  teeth={
                    teethAge === "Adulto"
                      ? ADULT_TOOTH_PIECES
                      : CHILD_TOOTH_PIECES
                  }
                  setFormData={setFormData}
                />
              </View>
            </ScrollView>
          </View>
          {/* Description */}
          <View>
            <Text className="font-bold text-whiteBlue">Descripción:</Text>
            <TextInput
              className="bg-whiteBlue p-2 border rounded-lg h-32 text-lg"
              numberOfLines={10}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              style={{ textAlignVertical: "top" }}
              multiline
            />
          </View>
          {/* Total Cost */}
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-whiteBlue text-center">
              Costo Total:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="123.50"
              placeholderTextColor={"gray"}
              value={formData.totalCost.toString()}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  totalCost: text === "" ? text : Number(text),
                })
              }
              className="bg-whiteBlue p-2 border rounded-lg w-24 text-center"
            />
            <Text className="font-semibold text-whiteBlue">Bs.</Text>
          </View>
          {/* Save Button */}
          <Pressable
            onPress={() => handleRegisterTreatment()}
            className="justify-center items-center bg-blackBlue active:bg-darkBlue mt-5 p-1 border-2 border-whiteBlue rounded-full"
          >
            <Text className="font-bold text-whiteBlue text-lg">Registrar</Text>
          </Pressable>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

interface ToothButtonProps {
  adultStartWith: string;
  childStartWith: string;
  teeth: number[];
  isUpper?: boolean;
  setFormData: (newForm: any) => void;
  formData: {
    description: string;
    totalCost: number | "";
    Treatment_Id: number;
    dentalPieces: number[];
  };
}

export function ToothButton(props: ToothButtonProps) {
  const {
    adultStartWith,
    childStartWith,
    formData,
    teeth,
    isUpper = false,
    setFormData,
  } = props;

  return (
    <View className="flex-row">
      {teeth
        .filter((tooth) =>
          tooth
            .toString()
            .startsWith(teeth.length > 20 ? adultStartWith : childStartWith),
        )
        .map((tooth, i) => (
          <Pressable
            key={i}
            onPress={() => {
              const copy = [...formData.dentalPieces];
              if (copy.includes(tooth)) copy.splice(copy.indexOf(tooth), 1);
              else copy.push(tooth);
              setFormData({ ...formData, dentalPieces: copy });
            }}
            className={`min-w-10 mx-1 aspect-square items-center justify-center ${isUpper ? "rounded-b-xl" : "rounded-t-xl"} ${
              formData.dentalPieces.includes(tooth)
                ? "bg-blackBlue border border-whiteBlue"
                : "bg-whiteBlue border border-blackBlue"
            }`}
          >
            <Text
              className={
                formData.dentalPieces.includes(tooth)
                  ? "text-whiteBlue font-bold"
                  : "text-blackBlue"
              }
            >
              {tooth}
            </Text>
          </Pressable>
        ))}
    </View>
  );
}
