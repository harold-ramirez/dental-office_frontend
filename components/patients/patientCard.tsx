import { Patient } from "@/interfaces/interfaces";
import { Linking, Pressable, Text, View } from "react-native";
import { MedicalHistoryIcon, ProfileIconAlt, WhatsappIcon } from "../Icons";

interface PatientCardProps {
  patient: Patient;
  openId: number | null;
  setOpenId: (id: number | null) => void;
}

export default function PatientCard({
  patient,
  openId,
  setOpenId,
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
    if (patient.phoneNumber) {
      const url = `https://wa.me/591${patient.phoneNumber}`;
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
          <Text className="font-bold text-2xl">
            {patient.name} {patient.paternalSurname} {patient.maternalSurname}
          </Text>
          <Text>{patient.gender === "M" ? "Masculino" : "Femenino"}</Text>
          <Text>{age} años</Text>
          <Text
            className={`font-semibold ${!patient.phoneNumber ? `italic` : ``} `}
          >
            {patient.phoneNumber
              ? patient.phoneNumber
              : `Celular no registrado`}
          </Text>
        </View>
      </Pressable>

      <View
        className={`${
          showButtons ? `flex` : `hidden`
        } flex-row justify-end gap-3 p-1 w-full`}
      >
        {patient.phoneNumber && (
          <Pressable
            onPress={handleWhatsApp}
            className="justify-center items-center bg-darkBlue p-1 rounded-md size-10"
          >
            <WhatsappIcon color="white" size={27} />
          </Pressable>
        )}
        <Pressable className="justify-center items-center bg-darkBlue p-1 rounded-md size-10">
          <MedicalHistoryIcon color="white" size={30} />
        </Pressable>
        <Pressable className="justify-center items-center bg-darkBlue p-1 rounded-md size-10">
          <ProfileIconAlt color="white" size={25} />
        </Pressable>
      </View>
    </View>
  );
}
