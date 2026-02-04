import { AppointmentRequestDto } from "@/interfaces/interfaces";
import { AuthContext } from "@/utils/authContext";
import { Link, RelativePathString } from "expo-router";
import { useContext } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import {
  CalendarCheckIcon,
  CalendarClockIcon,
  PhoneIcon,
  UserCircleIcon,
  WhatsappIcon,
  XIcon,
} from "../Icons";
import { DeleteAlertMessage } from "../alertMessage";

interface RequestCardProps {
  request: AppointmentRequestDto;
  isRequestActive?: boolean;
  openId: number | null;
  defaultMessage: string;
  setOpenId: (id: number | null) => void;
}

export default function RequestCard({ ...props }: RequestCardProps) {
  const showButtons = props.openId === props.request.Id;
  const { logOut } = useContext(AuthContext);

  const toggleButtons = () => {
    props.setOpenId(showButtons ? null : props.request.Id);
  };
  const formatDate = (date: string) => {
    const dayName = new Date(props.request.dateHourRequest).toLocaleDateString(
      "es-BO",
      { weekday: "long" },
    );
    const day = new Date(props.request.dateHourRequest).toLocaleDateString(
      "es-BO",
      { day: "2-digit" },
    );
    const month = new Date(props.request.dateHourRequest).toLocaleDateString(
      "es-BO",
      { month: "short" },
    );
    const year = new Date(props.request.dateHourRequest).toLocaleDateString(
      "es-BO",
      { year: "2-digit" },
    );
    const hour = new Date(props.request.dateHourRequest)
      .toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/[\s.]/g, "")
      .toLowerCase();
    return dayName + `\n` + day + `/` + month + `/` + year + `\n` + hour;
  };
  const handleWhatsApp = () => {
    if (props.request.phoneNumber) {
      const msg = props.defaultMessage
        ? encodeURIComponent(props.defaultMessage)
        : "";
      const url = `https://wa.me/591${props.request.phoneNumber}?text=${msg}`;
      Linking.openURL(url);
    } else {
      alert("El paciente no tiene número de teléfono registrado.");
    }
  };

  return (
    <View
      className={
        showButtons && props.isRequestActive ? `bg-whiteBlue rounded-2xl` : ``
      }
    >
      <Pressable
        onPress={toggleButtons}
        className={`gap-3 rounded-2xl p-3 ${
          props.isRequestActive ? `bg-lightBlue` : `bg-whiteBlue/50`
        }`}
      >
        <View>
          <View className="flex-row gap-1">
            <UserCircleIcon color="#001B48" size={75} />
            {/* Patient Info */}
            <View className="flex-1">
              <Text className="font-bold text-blackBlue text-xl">
                {props.request.patientFullName}
              </Text>
              <Text className="font-bold text-darkBlue">
                <PhoneIcon color="#02457A" size={17} />{" "}
                {props.request.phoneNumber}
              </Text>
            </View>

            {/* Request Date/Hour */}
            <Text className="font-semibold text-darkBlue text-sm text-right capitalize">
              {formatDate(props.request.dateHourRequest)}
            </Text>
            <CalendarClockIcon color="#001B48" size={50} />
          </View>

          {/* Request Message */}
          <Text
            numberOfLines={showButtons ? 0 : 1}
            ellipsizeMode="tail"
            className="bg-darkBlue/80 my-4 p-3 rounded-tr-xl rounded-bl-xl font-semibold text-whiteBlue text-lg text-justify italic"
          >
            &quot;{props.request.message}&quot;
          </Text>

          <Text className="text-blackBlue/80 text-sm text-right italic">
            Enviado el{" "}
            {new Date(props.request.registerDate).toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
        </View>
      </Pressable>

      {/* Action Buttons */}
      {showButtons && props.isRequestActive && (
        <View className="flex-row">
          {/* Discard Button */}
          <View className="p-2">
            <Pressable
              onPress={() => {
                DeleteAlertMessage(
                  "Descartar Solicitud?",
                  "¿Está seguro de descartar la solicitud? Esta acción es irreversible",
                  "Descartar",
                  `/appointment-requests/${props.request.Id}/1`,
                  "No se pudo descartar la solicitud. Inténtelo de nuevo.",
                  "DELETE",
                  "/(tabs)/requests" as RelativePathString,
                  logOut,
                );
              }}
              className="justify-center items-center active:bg-red-100 px-2 py-1 border border-red-500 rounded-lg"
            >
              <XIcon color="#ef4444" size={30} />
              <Text className="font-semibold text-red-500 text-xs text-center">
                Descartar
              </Text>
            </Pressable>
          </View>

          <View className="flex-row flex-1 justify-end gap-3 p-2">
            {/* Send-to-Whatsapp Button */}
            {props.request.phoneNumber && (
              <Pressable
                onPress={handleWhatsApp}
                className="justify-center items-center active:bg-lightBlue px-2 py-1 border-2 border-darkBlue rounded-lg"
              >
                <WhatsappIcon color="#02457A" size={32} className="flex-1" />
                <Text className="font-semibold text-darkBlue text-xs text-center">
                  Mensaje
                </Text>
              </Pressable>
            )}

            {/* Re-schedule Button */}
            <Link
              asChild
              href={{
                pathname: "/(protected)/createAppointment/[selectedDate]",
                params: {
                  selectedDate: props.request.dateHourRequest,
                  requestID: props.request.Id,
                  requestName: props.request.patientFullName,
                  sentRequestDate: props.request.registerDate,
                },
              }}
            >
              <Pressable className="justify-center items-center bg-darkBlue active:bg-pureBlue px-2 py-1 border-2 border-darkBlue rounded-lg">
                <CalendarCheckIcon
                  color="#D6E8EE"
                  size={32}
                  className="flex-1"
                />
                <Text className="font-semibold text-whiteBlue text-xs text-center">
                  Programar
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      )}
    </View>
  );
}
