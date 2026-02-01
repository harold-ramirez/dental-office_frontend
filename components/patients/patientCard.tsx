import { PatientDto } from "@/interfaces/interfaces";
import { Link } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import {
  CakeIcon,
  FemaleIcon,
  MaleIcon,
  MedicalHistoryIcon,
  PhoneIcon,
  ProfileIconAlt,
  WhatsappIcon,
} from "../Icons";

interface PatientCardProps {
  patient: PatientDto;
  openId: number | null;
  setOpenId: (id: number | null) => void;
  defaultMessage: string;
}

export default function PatientCard({
  patient,
  openId,
  setOpenId,
  defaultMessage,
}: PatientCardProps) {
  let age: number = 0;
  if (patient.birthdate) {
    const birth = new Date(patient.birthdate);
    const today = new Date();
    age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  }
  const showButtons = openId === patient.Id;
  const toggleButtons = () => {
    setOpenId(showButtons ? null : patient.Id);
  };
  const handleWhatsApp = () => {
    if (patient.cellphoneNumber) {
      const msg = defaultMessage ? encodeURIComponent(defaultMessage) : "";
      const url = `https://wa.me/591${patient.cellphoneNumber}?text=${msg}`;
      Linking.openURL(url);
    } else {
      alert("El paciente no tiene número de teléfono registrado.");
    }
  };

  return (
    <View
      className={`rounded-lg w-full ${
        showButtons ? `bg-lightBlue` : `bg-whiteBlue`
      }`}
    >
      <Pressable
        onPress={toggleButtons}
        className={`flex-row gap-5 bg-whiteBlue active:bg-lightBlue p-2 rounded-lg w-full`}
      >
        <View
          className={`rounded-full size-24 items-center justify-center ${
            patient.gender === "M" ? `bg-blue-300` : `bg-pink-300`
          }`}
        >
          <ProfileIconAlt
            size={age <= 15 ? 30 : 50}
            color={patient.gender === "M" ? "black" : "white"}
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-blackBlue text-2xl">
            {[patient?.name, patient?.paternalSurname, patient?.maternalSurname]
              .filter(Boolean)
              .join(" ")}
          </Text>
          <View className="flex-row items-center gap-2">
            <PhoneIcon size={21} color="#02457A" />
            <Text className={`text-darkBlue text-lg`}>
              {patient.cellphoneNumber
                ? patient.cellphoneNumber
                : `- - - - - - - -`}
            </Text>
          </View>
          {patient.gender === "M" ? (
            <View className="flex-row items-center gap-2">
              <View className="bg-darkBlue rounded-md">
                <MaleIcon size={18} color="#D6E8EE" />
              </View>
              <Text className="text-darkBlue">Masculino</Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <View className="bg-darkBlue rounded-md">
                <FemaleIcon size={18} color="#D6E8EE" />
              </View>
              <Text className="text-darkBlue">Femenino</Text>
            </View>
          )}
          <View className="flex-row items-center gap-2">
            <CakeIcon size={18} color="#02457A" />
            <Text className="text-darkBlue">{age} años</Text>
          </View>
        </View>
      </Pressable>

      <View
        className={`${
          showButtons ? `flex` : `hidden`
        } flex-row justify-end gap-3 p-1 w-full`}
      >
        {patient.cellphoneNumber && (
          <Pressable
            onPress={handleWhatsApp}
            className="justify-center items-center bg-darkBlue p-1 rounded-md size-10"
          >
            <WhatsappIcon color="white" size={27} />
          </Pressable>
        )}
        <Link
          href={{
            pathname: "/medicalHistory/[patientId]",
            params: { patientId: patient.Id.toString() },
          }}
          className="justify-center items-center bg-darkBlue p-1 rounded-md size-10"
        >
          <MedicalHistoryIcon color="white" size={30} />
        </Link>
        <Link
          href={{
            pathname: "/patientProfile/[id]",
            params: { id: patient.Id.toString() },
          }}
          asChild
        >
          <Pressable className="justify-center items-center bg-darkBlue p-1 rounded-md size-10">
            <ProfileIconAlt color="white" size={25} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
