import GlassyBackground from "@/components/glassyBackground";
import { PlusIcon } from "@/components/Icons";
import Loading from "@/components/loading";
import OptionalTextInput from "@/components/optionalTextInput";
import { YesNoRadio } from "@/components/radioButton";
import { MedicalHistoryDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const { logOut } = useContext(AuthContext);
  const [isPosting, setIsPosting] = useState(false);
  const [showNewFormBtn, setShowNewFormBtn] = useState(true);
  const [habits, setHabits] = useState<{ Id: number; name: string }[]>([]);
  const [histories, setHistories] = useState<MedicalHistoryDto[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [newPathologyHabit, setNewPathologyHabit] = useState({
    showPathologyTextInput: false,
    showHabitTextInput: false,
    newPathology: "",
    newHabit: "",
  });
  const [personalPathologies, setPersonalPathologies] = useState<
    { Id: number; name: string }[]
  >([]);

  // UI EVENTS ************************************
  const newMedicalHistory = () => {
    setShowNewFormBtn(false);
    const copy = [...histories];
    copy.push({
      registerDate: new Date().toISOString(),
      personalPathologieshistory: [],
      habits: [],
      familyPathologicalHistory: "",
      allergies: "",
      pregnantMonths: "",
      medicalTreatment: "",
      takingMedicine: "",
      hemorrhageType: "",
      tmj: "",
      lymphNodes: "",
      breathingType: "",
      others: "",
      lipsStatus: "",
      tongueStatus: "",
      palateStatus: "",
      mouthFloorStatus: "",
      buccalMucousStatus: "",
      gumsStatus: "",
      prosthesisLocation: "",
      lastTimeVisitedDentist: "",
      useDentalFloss: false,
      useMouthWash: false,
      toothBrushingFrequency: "",
      hasBleedOnToothBrushing: false,
      oralHygiene: "",
    });
    setHistories(copy);
    setFormData(copy[copy.length - 1]);
  };
  const selectPathology = (id: number) => {
    const updatedPathologies = [...(formData.personalPathologieshistory || [])];
    const index = updatedPathologies.findIndex((p) => p.Id === id);
    if (index > -1) {
      updatedPathologies.splice(index, 1);
    } else {
      const pathology = personalPathologies.find((p) => p.Id === id);
      if (pathology) {
        updatedPathologies.push({ Id: pathology.Id, name: pathology.name });
      }
    }
    setFormData({
      ...formData,
      personalPathologieshistory: updatedPathologies,
    });
  };
  const selectHabit = (id: number) => {
    const updatedHabits = [...(formData.habits || [])];
    const index = updatedHabits.findIndex((h) => h.Id === id);
    if (index > -1) {
      updatedHabits.splice(index, 1);
    } else {
      const habit = habits.find((h) => h.Id === id);
      if (habit) {
        updatedHabits.push({ Id: habit.Id, name: habit.name });
      }
    }
    setFormData({
      ...formData,
      habits: updatedHabits,
    });
  };

  // API CALLINGS ******************************
  const handlePostPathology = async () => {
    if (newPathologyHabit.newPathology === "") return;
    try {
      const res = await fetchWithToken(
        "/personal-pathologies",
        {
          method: "POST",
          body: JSON.stringify({
            name: newPathologyHabit.newPathology,
          }),
        },
        logOut,
      );
      setPersonalPathologies((prev) => [
        ...prev,
        { Id: res.Id, name: res.name },
      ]);

      // Pre-select the pathology form
      if (!formData.Id) {
        setFormData({
          ...formData,
          personalPathologieshistory: [
            ...(formData.personalPathologieshistory || []),
            { Id: res.Id, name: res.name },
          ],
        });
      }
    } catch (error) {
      console.log("Error posting new Pathology:", error);
    } finally {
      setNewPathologyHabit({
        ...newPathologyHabit,
        showPathologyTextInput: false,
        newPathology: "",
      });
    }
  };
  const handlePostHabit = async () => {
    if (newPathologyHabit.newHabit === "") return;
    try {
      const res = await fetchWithToken(
        "/habits",
        {
          method: "POST",
          body: JSON.stringify({
            name: newPathologyHabit.newHabit,
          }),
        },
        logOut,
      );
      setHabits((prev) => [...prev, { Id: res.Id, name: res.name }]);

      // Pre-select the pathology form
      if (!formData.Id) {
        setFormData({
          ...formData,
          habits: [...(formData.habits || []), { Id: res.Id, name: res.name }],
        });
      }
    } catch (error) {
      console.log("Error posting new Habit:", error);
    } finally {
      setNewPathologyHabit({
        ...newPathologyHabit,
        showHabitTextInput: false,
        newHabit: "",
      });
    }
  };
  const handlePostForm = async () => {
    try {
      setIsPosting(true);
      await fetchWithToken(
        "/medical-history",
        {
          method: "POST",
          body: JSON.stringify({
            Patient_Id: Number(patientId),
            personalPathologieshistory: formData.personalPathologieshistory,
            habits: formData.habits,
            familyPathologicalHistory:
              formData.familyPathologicalHistory === ""
                ? null
                : formData.familyPathologicalHistory,
            allergies: formData.allergies === "" ? null : formData.allergies,
            pregnantMonths:
              formData.pregnantMonths === "" ? null : formData.pregnantMonths,
            medicalTreatment:
              formData.medicalTreatment === ""
                ? null
                : formData.medicalTreatment,
            takingMedicine:
              formData.takingMedicine === "" ? null : formData.takingMedicine,
            hemorrhageType:
              formData.hemorrhageType === "" ? null : formData.hemorrhageType,
            tmj: formData.tmj === "" ? null : formData.tmj,
            lymphNodes: formData.lymphNodes === "" ? null : formData.lymphNodes,
            breathingType:
              formData.breathingType === "" ? null : formData.breathingType,
            others: formData.others === "" ? null : formData.others,
            lipsStatus: formData.lipsStatus === "" ? null : formData.lipsStatus,
            tongueStatus:
              formData.tongueStatus === "" ? null : formData.tongueStatus,
            palateStatus:
              formData.palateStatus === "" ? null : formData.palateStatus,
            mouthFloorStatus:
              formData.mouthFloorStatus === ""
                ? null
                : formData.mouthFloorStatus,
            buccalMucousStatus:
              formData.buccalMucousStatus === ""
                ? null
                : formData.buccalMucousStatus,
            gumsStatus: formData.gumsStatus === "" ? null : formData.gumsStatus,
            prosthesisLocation:
              formData.prosthesisLocation === ""
                ? null
                : formData.prosthesisLocation,
            lastTimeVisitedDentist:
              formData.lastTimeVisitedDentist === ""
                ? null
                : formData.lastTimeVisitedDentist,
            useDentalFloss: formData.useDentalFloss,
            useMouthWash: formData.useMouthWash,
            toothBrushingFrequency:
              formData.toothBrushingFrequency === ""
                ? null
                : formData.toothBrushingFrequency,
            hasBleedOnToothBrushing: formData.hasBleedOnToothBrushing,
            oralHygiene:
              formData.oralHygiene === "" ? null : formData.oralHygiene,
          }),
        },
        logOut,
      );
      setIsPosting(false);
      router.replace({
        pathname: "/(protected)/patientProfile/[id]",
        params: {
          id: patientId.toString(),
          refresh: Date.now().toString(),
        },
      });
    } catch (error) {
      console.log("Error posting new medical history:", error);
      setIsPosting(false);
    }
  };

  // REACT HOOKS **************************************************
  const fetchAllMedicalHistories = useCallback(async () => {
    try {
      const data = await fetchWithToken(
        `/medical-history/${patientId}`,
        { method: "GET" },
        logOut,
      );
      setHistories(data);
      setFormData(data[0]);
      const habits = await fetchWithToken("/habits", { method: "GET" }, logOut);
      const personalPathologies = await fetchWithToken(
        "/personal-pathologies",
        { method: "GET" },
        logOut,
      );
      setHabits(habits);
      setPersonalPathologies(personalPathologies);
    } catch (e) {
      console.error("Error fetching medical histories:", e);
    }
  }, [patientId, logOut]);
  useEffect(() => {
    fetchAllMedicalHistories();
  }, [fetchAllMedicalHistories]);

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
          <ScrollView
            horizontal
            className="pb-2"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row gap-1">
              {histories.map((history, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setFormData(histories[i]);
                  }}
                  className={`active:bg-lightBlue px-4 py-1 rounded-t-2xl border border-whiteBlue ${
                    formData.registerDate === history.registerDate
                      ? `bg-whiteBlue`
                      : `bg-darkBlue`
                  }`}
                >
                  <Text
                    className={`text-blackBlue ${
                      !history.Id ? `font-bold italic` : ``
                    } ${
                      formData.registerDate === history.registerDate
                        ? `text-darkBlue`
                        : `text-whiteBlue`
                    }`}
                  >
                    {new Date(
                      history.registerDate as string,
                    ).toLocaleDateString("es-BO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {!history.Id ? "*" : ""}
                  </Text>
                </Pressable>
              ))}

              {/* New Medical History */}
              {showNewFormBtn && (
                <Pressable
                  onPress={() => newMedicalHistory()}
                  className="justify-center items-center bg-darkBlue active:bg-lightBlue px-3 py-1 border border-whiteBlue rounded-t-2xl"
                >
                  <Text className="font-bold text-whiteBlue">
                    + Nuevo Formulario
                  </Text>
                </Pressable>
              )}
            </View>
          </ScrollView>

          {histories.length === 0 ? (
            <GlassyBackground className="gap-2 px-3 py-6 rounded-xl w-full">
              <Text className="text-whiteBlue text-center italic">
                No hay registro de una historia clínica para este paciente
              </Text>
            </GlassyBackground>
          ) : (
            <View className="gap-5 pb-5">
              {/* PATIENT'S PATHOLOGIES */}
              <GlassyBackground className="gap-2 p-3 rounded-xl w-full">
                <Text
                  className={`font-bold text-whiteBlue text-xl text-center uppercase ${
                    !formData.Id ? `italic` : ``
                  }`}
                >
                  {new Date(formData.registerDate).toLocaleDateString("es-BO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <View>
                  <Text className="font-bold text-whiteBlue text-lg">
                    Antecedentes Patológicos Familiares
                  </Text>
                  <TextInput
                    placeholder="..."
                    placeholderTextColor={"gray"}
                    readOnly={formData.Id}
                    value={formData.familyPathologicalHistory}
                    onChangeText={(val) =>
                      setFormData({
                        ...formData,
                        familyPathologicalHistory: val,
                      })
                    }
                    className="bg-whiteBlue border border-blackBlue rounded-xl w-full text-center"
                  />
                </View>
                <View>
                  <Text className="font-bold text-whiteBlue text-lg">
                    Antecedentes Patológicos Personales
                  </Text>
                  <View className="gap-5 bg-whiteBlue p-2 rounded-xl">
                    <View className="flex-row flex-wrap flex-1 gap-2">
                      {personalPathologies.map((pathology, i) => (
                        <Pressable
                          key={i}
                          disabled={!!formData.Id}
                          onPress={() => {
                            selectPathology(pathology.Id);
                          }}
                          className={`justify-center items-center active:bg-lightBlue px-5 border-2 border-blackBlue rounded-full ${
                            formData.personalPathologieshistory?.some(
                              (p: any) => p.Id === pathology.Id,
                            )
                              ? "bg-blackBlue"
                              : "bg-whiteBlue"
                          }`}
                        >
                          <Text
                            className={`font-semibold ${
                              formData.personalPathologieshistory?.some(
                                (p: any) => p.Id === pathology.Id,
                              )
                                ? "text-whiteBlue"
                                : "text-blackBlue"
                            }`}
                          >
                            {pathology.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    <View className="flex-row justify-end items-end gap-2">
                      {newPathologyHabit.showPathologyTextInput && (
                        <TextInput
                          placeholder="Nueva Patología"
                          placeholderTextColor={"gray"}
                          value={newPathologyHabit.newPathology}
                          onChangeText={(val) =>
                            setNewPathologyHabit({
                              ...newPathologyHabit,
                              newPathology: val,
                            })
                          }
                          className="flex-1 border rounded-xl text-blackBlue text-center"
                        />
                      )}
                      {!formData.Id &&
                        (!newPathologyHabit.showPathologyTextInput ? (
                          <Pressable
                            onPress={() => {
                              setNewPathologyHabit({
                                ...newPathologyHabit,
                                showPathologyTextInput:
                                  !newPathologyHabit.showPathologyTextInput,
                              });
                            }}
                            className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4"
                          >
                            <PlusIcon size={24} color="#D6E8EE" />
                            <Text className="text-whiteBlue">Otro</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={handlePostPathology}
                            className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4"
                          >
                            <Text className="text-whiteBlue">Añadir</Text>
                          </Pressable>
                        ))}
                    </View>
                  </View>
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="flex-1 font-semibold text-whiteBlue">
                    Alergias
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.allergies ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Ej. Maní"
                      isReadOnly={formData.Id}
                      value={formData.allergies}
                      setValue={(val) =>
                        setFormData({ ...formData, allergies: val })
                      }
                    />
                  )}
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="flex-1 font-semibold text-whiteBlue">
                    Embarazo
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.pregnantMonths ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Ej. 3 Meses"
                      isReadOnly={formData.Id}
                      value={formData.pregnantMonths}
                      setValue={(val) =>
                        setFormData({ ...formData, pregnantMonths: val })
                      }
                    />
                  )}
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="flex-1 font-semibold text-whiteBlue">
                    Está en Tratamiento Médico?
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.medicalTreatment ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Ej. ..."
                      isReadOnly={formData.Id}
                      value={formData.medicalTreatment}
                      setValue={(val) =>
                        setFormData({ ...formData, medicalTreatment: val })
                      }
                    />
                  )}
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="flex-1 font-semibold text-whiteBlue">
                    Actualmente recibe algún medicamento?
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.takingMedicine ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Ej. Aspirina"
                      isReadOnly={formData.Id}
                      value={formData.takingMedicine}
                      setValue={(val) =>
                        setFormData({ ...formData, takingMedicine: val })
                      }
                    />
                  )}
                </View>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="flex-1 font-semibold text-whiteBlue">
                    Tuvo hemorragia después de una extracción dental?
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.hemorrhageType ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Ej. Inmediata"
                      isReadOnly={formData.Id}
                      value={formData.hemorrhageType}
                      setValue={(val) =>
                        setFormData({
                          ...formData,
                          hemorrhageType: val,
                        })
                      }
                    />
                  )}
                </View>
              </GlassyBackground>

              {/* INTRAORAL EXAMINATION */}
              <GlassyBackground className="gap-2 p-3 rounded-xl w-full">
                <Text className="font-bold text-whiteBlue text-center">
                  EXAMEN INTRAORAL
                </Text>
                <View>
                  <Text className="font-semibold text-whiteBlue">ATM</Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.tmj}
                    onChangeText={(val) =>
                      setFormData({ ...formData, tmj: val })
                    }
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">
                    Ganglios Linfáticos
                  </Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.lymphNodes}
                    onChangeText={(val) =>
                      setFormData({ ...formData, lymphNodes: val })
                    }
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">
                    Respiración
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({ ...formData, breathingType: "Nasal" })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.breathingType === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.breathingType === "Nasal"
                            ? `bg-darkBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.breathingType === "Nasal"
                            ? `text-whiteBlue`
                            : `text-blackBlue`
                        }`}
                      >
                        Nasal
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({ ...formData, breathingType: "Mouth" })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.breathingType === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.breathingType === "Mouth"
                            ? `bg-darkBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.breathingType === "Mouth"
                            ? `text-whiteBlue`
                            : `text-blackBlue`
                        }`}
                      >
                        Bucal
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          breathingType: "Oral-Nasal",
                        })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.breathingType === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.breathingType === "Oral-Nasal"
                            ? `bg-darkBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.breathingType === "Oral-Nasal"
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
                    readOnly={formData.Id}
                    value={formData.others}
                    onChangeText={(val) =>
                      setFormData({ ...formData, others: val })
                    }
                    className="bg-whiteBlue p-2 rounded-xl h-24 text-blackBlue"
                    style={{ textAlignVertical: "top" }}
                  />
                </View>
              </GlassyBackground>

              {/* INTRAORAL EXAMINATION */}
              <GlassyBackground className="gap-2 p-3 rounded-xl w-full">
                <Text className="font-bold text-whiteBlue text-center">
                  EXAMEN INTRAORAL
                </Text>
                <View>
                  <Text className="font-semibold text-whiteBlue">Labios</Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.lipsStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, lipsStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">Lengua</Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.tongueStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, tongueStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">Paladar</Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.palateStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, palateStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">
                    Piso de la Boca
                  </Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.mouthFloorStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, mouthFloorStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">
                    Mucosa Yugal
                  </Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.buccalMucousStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, buccalMucousStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">Encías</Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.gumsStatus}
                    onChangeText={(val) => {
                      setFormData({ ...formData, gumsStatus: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View className="flex-row justify-between gap-3">
                  <Text className="font-semibold text-whiteBlue">
                    Utiliza Prótesis intraoral?
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.prosthesisLocation ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="..."
                      isReadOnly={formData.Id}
                      value={formData.prosthesisLocation}
                      setValue={(val) =>
                        setFormData({ ...formData, prosthesisLocation: val })
                      }
                    />
                  )}
                </View>
              </GlassyBackground>

              {/* PATIENT'S ORAL HISTORY */}
              <GlassyBackground className="gap-2 p-3 rounded-xl w-full">
                <Text className="font-bold text-whiteBlue text-center">
                  ANTECEDENTES BUCODENTALES
                </Text>
                <View>
                  <Text className="font-semibold text-whiteBlue">
                    Fecha de la última vez que visitó al odontólogo
                  </Text>
                  <TextInput
                    readOnly={formData.Id}
                    value={formData.lastTimeVisitedDentist}
                    onChangeText={(val) => {
                      setFormData({ ...formData, lastTimeVisitedDentist: val });
                    }}
                    className="bg-whiteBlue rounded-xl text-center"
                  />
                </View>
                <View>
                  <Text className="font-semibold text-whiteBlue">Hábitos</Text>
                  <View className="gap-3 bg-whiteBlue p-2 rounded-xl">
                    <View className="flex-row flex-wrap flex-1 gap-2">
                      {habits.map((habit, i) => (
                        <Pressable
                          key={i}
                          disabled={!!formData.Id}
                          onPress={() => {
                            selectHabit(habit.Id);
                          }}
                          className={`justify-center items-center px-5 border-2 border-blackBlue rounded-full ${
                            formData.habits?.some((p: any) => p.Id === habit.Id)
                              ? "bg-blackBlue"
                              : "bg-whiteBlue"
                          }`}
                        >
                          <Text
                            className={`font-semibold text-blackBlue ${
                              formData.habits?.some(
                                (p: any) => p.Id === habit.Id,
                              )
                                ? "text-whiteBlue"
                                : "text-blackBlue"
                            }`}
                          >
                            {habit.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    <View className="flex-row justify-end items-end gap-2">
                      {newPathologyHabit.showHabitTextInput && (
                        <TextInput
                          placeholder="Nuevo Hábito"
                          placeholderTextColor={"gray"}
                          value={newPathologyHabit.newHabit}
                          onChangeText={(val) =>
                            setNewPathologyHabit({
                              ...newPathologyHabit,
                              newHabit: val,
                            })
                          }
                          className="flex-1 border rounded-xl text-blackBlue text-center"
                        />
                      )}
                      {!formData.Id &&
                        (!newPathologyHabit.showHabitTextInput ? (
                          <Pressable
                            onPress={() => {
                              setNewPathologyHabit({
                                ...newPathologyHabit,
                                showHabitTextInput:
                                  !newPathologyHabit.showHabitTextInput,
                              });
                            }}
                            className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4"
                          >
                            <PlusIcon size={24} color="#D6E8EE" />
                            <Text className="text-whiteBlue">Otro</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={handlePostHabit}
                            className="flex-row justify-center items-center gap-2 bg-darkBlue active:bg-blackBlue p-1 rounded-lg w-1/4"
                          >
                            <Text className="text-whiteBlue">Añadir</Text>
                          </Pressable>
                        ))}
                    </View>
                  </View>
                </View>
              </GlassyBackground>

              {/* ORAL HYGIENE HISTORY */}
              <GlassyBackground className="gap-2 p-3 rounded-xl w-full">
                <Text className="font-bold text-whiteBlue text-center">
                  ANTECEDENTES DE HIGIENE BUCAL
                </Text>
                <View className="flex-row justify-between items-center gap-3">
                  <Text className="font-semibold text-whiteBlue">
                    Utiliza cepillo dental?
                  </Text>
                  {formData.Id ? (
                    <TextInput
                      className="flex-1 bg-whiteBlue px-1 rounded-lg h-11 text-center"
                      value={formData.toothBrushingFrequency ?? "-"}
                      editable={false}
                    />
                  ) : (
                    <OptionalTextInput
                      placeholder="Frecuencia"
                      isReadOnly={formData.Id}
                      value={formData.toothBrushingFrequency}
                      setValue={(val) =>
                        setFormData({
                          ...formData,
                          toothBrushingFrequency: val,
                        })
                      }
                    />
                  )}
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-whiteBlue">
                    Utiliza hilo dental?
                  </Text>
                  <YesNoRadio
                    isDisabled={!!formData.Id}
                    value={formData.useDentalFloss}
                    onChange={(val) =>
                      setFormData({ ...formData, useDentalFloss: val })
                    }
                  />
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-whiteBlue">
                    Utiliza enjuague bucal?
                  </Text>
                  <YesNoRadio
                    isDisabled={!!formData.Id}
                    value={formData.useMouthWash}
                    onChange={(val) =>
                      setFormData({ ...formData, useMouthWash: val })
                    }
                  />
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-whiteBlue">
                    Durante el cepillado dental,{`\n`}le sangran las encías?
                  </Text>
                  <YesNoRadio
                    isDisabled={!!formData.Id}
                    value={formData.hasBleedOnToothBrushing}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        hasBleedOnToothBrushing: val,
                      })
                    }
                  />
                </View>
                <View className="gap-2">
                  <Text className="font-semibold text-whiteBlue">
                    Higiene Bucodental
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({ ...formData, oralHygiene: "Good" })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.oralHygiene === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.oralHygiene === "Good"
                            ? `bg-blackBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.oralHygiene === "Good"
                            ? `text-whiteBlue`
                            : `text-blackBlue`
                        }`}
                      >
                        Buena
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({ ...formData, oralHygiene: "Regular" })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.oralHygiene === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.oralHygiene === "Regular"
                            ? `bg-blackBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.oralHygiene === "Regular"
                            ? `text-whiteBlue`
                            : `text-blackBlue`
                        }`}
                      >
                        Regular
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={!!formData.Id}
                      onPress={() =>
                        setFormData({ ...formData, oralHygiene: "Bad" })
                      }
                      className={`items-center py-1 border-2 rounded-full flex-1 ${
                        formData.oralHygiene === ""
                          ? `bg-whiteBlue border-blackBlue`
                          : formData.oralHygiene === "Bad"
                            ? `bg-blackBlue border-whiteBlue`
                            : `bg-whiteBlue/30 border-blackBlue`
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          formData.oralHygiene === "Bad"
                            ? `text-whiteBlue`
                            : `text-blackBlue`
                        }`}
                      >
                        Mala
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </GlassyBackground>

              {/* Go to Odontogram */}
              <View>
                <Link
                  asChild
                  href={{
                    pathname: "/(protected)/odontogram/[patientId]",
                    params: {
                      patientId: patientId.toString(),
                    },
                  }}
                >
                  <Pressable className="justify-center overflow-hidden items-center px-4 py-2 rounded-md">
                    <LinearGradient
                      colors={["#02457A", "#018ABE"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="absolute top-0 bottom-0 right-0 left-0"
                    />
                    <Text className="font-semibold text-whiteBlue">
                      Ver Odontograma
                    </Text>
                  </Pressable>
                </Link>
              </View>

              {/* SAVE-DELETE BUTTONS */}
              <View className="items-center">
                {!formData.Id ? (
                  <Pressable
                    onPress={handlePostForm}
                    disabled={isPosting}
                    className="items-center bg-blackBlue active:bg-pureBlue p-2 border border-whiteBlue rounded-full w-2/3"
                  >
                    {isPosting ? (
                      <Loading
                        className="flex-1"
                        innerClassName="w-full p-1 justify-center items-center"
                        size={24}
                      />
                    ) : (
                      <Text className="font-bold text-whiteBlue text-xl">
                        Guardar
                      </Text>
                    )}
                  </Pressable>
                ) : (
                  <></>
                  // <Pressable
                  //   className="items-center bg-red-700 active:bg-red-600 px-2 py-1 border border-whiteBlue rounded-full w-2/3"
                  //   onPress={() => {
                  //     DeleteAlertMessage(
                  //       "Confirmar Eliminación",
                  //       `¿Está seguro de eliminar el registro?`,
                  //       "Eliminar",
                  //       `/medical-history/${formData.Id}`,
                  //       "No se pudo eliminar la historia clínica. Inténtalo de nuevo.",
                  //       "DELETE",
                  //       `/(protected)/patientProfile/[id]` as RelativePathString,
                  //       logOut,
                  //       { id: patientId.toString() },
                  //     );
                  //   }}
                  // >
                  //   <Text className="font-semibold text-whiteBlue text-lg">
                  //     Eliminar Historia Clínica
                  //   </Text>
                  // </Pressable>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
