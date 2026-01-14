import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Props {
  patientId: number;
  onClose: () => void;
}

export default function TreatmentModal(props: Props) {
  const { patientId = 0, onClose } = props;
  const [formData, setFormData] = useState<{
    description: string;
    totalCost: number | "";
    Treatment_Id: number;
    dentalPieces: number[];
    AppUser_Id: number;
  }>({
    description: "",
    totalCost: "",
    Treatment_Id: 0,
    dentalPieces: [],
    AppUser_Id: 1, //Hardcoded userID
  });
  const [treatmentList, setTreatmentList] = useState<
    { label: string; value: string }[]
  >([]);
  const [teeth, setTeeth] = useState<{ Id: number; pieceNumber: number }[]>([]);

  const fetchTreatmentList = useCallback(async () => {
    try {
      const data: { Id: number; name: string }[] = await fetch(
        `${apiUrl}/treatments`
      ).then((res) => res.json());
      const parsed: { label: string; value: string }[] = [];
      data.map((treatment) => {
        parsed.push({
          label: treatment.name,
          value: treatment.Id.toString(),
        });
      });
      setTreatmentList(parsed);
      // ***********************************
      const teethDB = await fetch(
        `${apiUrl}/odontogram/${patientId}/teeth`
      ).then((res) => res.json());
      setTeeth(teethDB);
    } catch (error) {
      console.log("Error fetching Treatments or Teeth:", error);
    }
  }, [patientId]);

  useEffect(() => {
    fetchTreatmentList();
  }, [fetchTreatmentList]);

  const handleRegisterTreatment = async () => {
    if (formData.Treatment_Id === 0) return;
    try {
      const res = await fetch(`${apiUrl}/diagnosed-procedure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description:
            formData.description === "" ? null : formData.description,
          totalCost: formData.totalCost === "" ? null : formData.totalCost,
          Patient_Id: patientId,
          Treatment_Id: formData.Treatment_Id,
          dentalPieces: formData.dentalPieces,
          AppUser_Id: formData.AppUser_Id,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        router.replace({
          pathname: "/(protected)/treatmentDetails/[treatmentId]",
          params: {
            treatmentId: created.Id.toString(),
          },
        });
        onClose();
      }
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
      }
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
          <Text className="font-bold text-whiteBlue">Piezas Dentales:</Text>
          <View className="flex-row bg-whiteBlue px-2 py-4 rounded-md w-full">
            {teeth.length === 0 ? (
              <Text className="text-center italic text-darkBlue">
                Por favor, registre primero una historia clínica del paciente
                para seleccionar las piezas dentales.
              </Text>
            ) : (
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
                    teeth={[...teeth].reverse()}
                    setFormData={setFormData}
                  />
                  <View className="my-2 border border-blackBlue rounded-full w-full" />
                  <ToothButton
                    adultStartWith="4"
                    childStartWith="8"
                    formData={formData}
                    teeth={[...teeth].reverse()}
                    setFormData={setFormData}
                  />
                </View>
                <View className="border border-blackBlue rounded-full h-full" />
                <View>
                  <ToothButton
                    adultStartWith="2"
                    childStartWith="6"
                    formData={formData}
                    teeth={teeth}
                    setFormData={setFormData}
                  />
                  <View className="my-2 border border-blackBlue rounded-full w-full" />
                  <ToothButton
                    adultStartWith="3"
                    childStartWith="7"
                    formData={formData}
                    teeth={teeth}
                    setFormData={setFormData}
                  />
                </View>
              </ScrollView>
            )}
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
  formData: {
    description: string;
    totalCost: number | "";
    Treatment_Id: number;
    dentalPieces: number[];
    AppUser_Id: number;
  };
  teeth: { Id: number; pieceNumber: number }[];
  setFormData: (newForm: any) => void;
}

export function ToothButton(props: ToothButtonProps) {
  const { adultStartWith, childStartWith, formData, teeth, setFormData } =
    props;

  return (
    <View className="flex-row">
      {teeth
        .filter((tooth) =>
          tooth.pieceNumber
            .toString()
            .startsWith(teeth.length > 20 ? adultStartWith : childStartWith)
        )
        .map((tooth) => (
          <Pressable
            key={tooth.Id}
            onPress={() => {
              const copy = [...formData.dentalPieces];
              if (copy.includes(tooth.Id))
                copy.splice(copy.indexOf(tooth.Id), 1);
              else copy.push(tooth.Id);
              setFormData({ ...formData, dentalPieces: copy });
            }}
            className={`min-w-10 mx-1 aspect-square items-center justify-center rounded-xl ${
              formData.dentalPieces.includes(tooth.Id)
                ? "bg-blackBlue border border-whiteBlue"
                : "bg-whiteBlue border border-blackBlue"
            }`}
          >
            <Text
              className={
                formData.dentalPieces.includes(tooth.Id)
                  ? "text-whiteBlue font-bold"
                  : "text-blackBlue"
              }
            >
              {tooth.pieceNumber}
            </Text>
          </Pressable>
        ))}
    </View>
  );
}
