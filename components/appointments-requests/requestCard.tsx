import { AppointmentRequestDto } from "@/interfaces/interfaces";
import { Linking, Pressable, Text, View } from "react-native";
import {
  CalendarClockIcon,
  CheckIcon,
  EditIcon,
  PhoneIcon,
  UserCircleIcon,
  WhatsappIcon,
} from "../Icons";

interface RequestCardProps {
  request: AppointmentRequestDto;
  openId: number | null;
  setOpenId: (id: number | null) => void;
}

export default function RequestCard({
  request,
  openId,
  setOpenId,
}: RequestCardProps) {
  const showButtons = openId === request.Id;
  const toggleButtons = () => {
    setOpenId(showButtons ? null : request.Id);
  };

  const handleWhatsApp = () => {
    if (request.phoneNumber) {
      const url = `https://wa.me/591${request.phoneNumber}`;
      Linking.openURL(url);
    } else {
      alert("El paciente no tiene número de teléfono registrado.");
    }
  };

  return (
    <View
      className={`rounded-3xl border-4 ${
        showButtons ? `bg-whiteBlue border-blackBlue` : `border-transparent`
      }`}
    >
      <Pressable
        onPress={toggleButtons}
        className={`gap-3 bg-lightBlue active:bg-whiteBlue rounded-2xl p-3 ${showButtons ? `rounded-b-none` : ``}`}
      >
        <View className="gap-2">
          <View className="flex-row gap-1">
            <UserCircleIcon color="#001B48" size={75} />
            <View className="flex-1">
              <Text className="font-bold text-blackBlue text-xl">
                {request.patientFullName}
              </Text>
              <Text className="font-bold text-darkBlue">
                <PhoneIcon color="#02457A" size={17} /> {request.phoneNumber}
              </Text>
            </View>
            <Text className="font-semibold text-darkBlue text-right text-sm capitalize">
              {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
                weekday: "long",
              })}
              {`\n`}
              {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
                day: "2-digit",
              })}
              /
              {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
                month: "short",
              })}
              /
              {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
                year: "2-digit",
              })}
              {`\n`}
              {new Date(request.dateHourRequest)
                .toLocaleTimeString("es-BO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(/[\s.]/g, "")
                .toLowerCase()}
            </Text>
            <CalendarClockIcon color="#001B48" size={50} />
          </View>
          <Text
            numberOfLines={showButtons ? 0 : 1}
            ellipsizeMode="tail"
            className="bg-darkBlue/80 my-4 p-3 rounded-bl-xl rounded-tr-xl font-semibold text-whiteBlue text-lg italic text-justify"
          >
            &quot;{request.message}&quot;
          </Text>
        </View>
      </Pressable>

      {showButtons && (
        <View className="flex-row justify-end gap-3 p-2">
          <Pressable className="justify-center items-center bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg">
            <EditIcon color="#D6E8EE" size={30} className="flex-1" />
            <Text className="font-semibold text-whiteBlue text-xs text-center">
              Reprogramar
            </Text>
          </Pressable>
          {request.phoneNumber && (
            <Pressable
              onPress={handleWhatsApp}
              className="justify-center items-center bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg"
            >
              <WhatsappIcon color="#D6E8EE" size={32} className="flex-1" />
              <Text className="font-semibold text-whiteBlue text-xs text-center">
                Mensaje
              </Text>
            </Pressable>
          )}
          <Pressable className="justify-center items-center bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg">
            <CheckIcon color="#D6E8EE" size={32} className="flex-1" />
            <Text className="font-semibold text-whiteBlue text-xs text-center">
              Confirmar
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
