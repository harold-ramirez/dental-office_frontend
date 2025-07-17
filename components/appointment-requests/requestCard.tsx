import { Pressable, Text, View } from "react-native";
import {
  CalendarClockIcon,
  CheckIcon,
  EditIcon,
  PhoneIcon,
  UserCircleIcon,
  WhatsappIcon,
} from "../Icons";

export default function RequestCard({ request }: any) {
  return (
    <View className="gap-3 bg-lightBlue active:bg-whiteBlue p-3 border-4 border-blackBlue rounded-2xl">
      <View className="gap-2">
        <View className="flex-row gap-1">
          <UserCircleIcon color="#001B48" size={75} />
          <View className="flex-1">
            <Text className="font-bold text-blackBlue text-2xl">
              {request.patientFullName}
            </Text>
            <Text className="font-semibold text-darkBlue text-xl">
              <PhoneIcon color="#02457A" size={20} /> {request.phoneNumber}
            </Text>
          </View>
          <Text className="font-semibold text-darkBlue text-right capitalize">
            {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
              weekday: "long",
            })}
            {`\n`}
            {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
              day: "2-digit",
            })}
            /
            {new Date(request.dateHourRequest).toLocaleDateString("es-BO", {
              month: "long",
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
          numberOfLines={5}
          ellipsizeMode="tail"
          className="p-1 font-semibold text-blackBlue italic text-balance"
        >
          &quot;{request.message}&quot;
        </Text>
      </View>
      <View className="flex-row justify-end gap-2">
        <Pressable className="flex-row items-center gap-1 bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg">
          <EditIcon color="#D6E8EE" size={28} />
          <Text className="font-semibold text-whiteBlue text-sm text-center">
            Reprogramar{`\n`}Cita
          </Text>
        </Pressable>
        <Pressable className="flex-row items-center gap-1 bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg">
          <WhatsappIcon color="#D6E8EE" size={30} />
          <Text className="font-semibold text-whiteBlue text-sm text-center">
            Enviar{`\n`}Mensaje
          </Text>
        </Pressable>
        <Pressable className="flex-row items-center gap-1 bg-darkBlue active:bg-pureBlue px-2 py-1 rounded-lg">
          <CheckIcon color="#D6E8EE" size={32} />
          <Text className="font-semibold text-whiteBlue text-sm text-center">
            Confirmar{`\n`}Solicitud
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
