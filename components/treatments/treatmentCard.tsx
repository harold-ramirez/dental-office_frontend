import { DiagnosedProcedureDto } from "@/interfaces/interfaces";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RightArrowIcon, ToothIcon } from "../Icons";

interface TreatmentCardProps {
  procedure: DiagnosedProcedureDto;
}

export default function TreatmentCard(props: TreatmentCardProps) {
  const { procedure } = props;

  return (
    <View className="flex-row bg-lightBlue rounded-lg">
      <View className="flex-row flex-1 items-center gap-1 p-1 my-2">
        <ToothIcon size={64} color="#02457A" />
        <View className="flex-1">
          <Text className="flex-1 min-h-8 font-extrabold text-blackBlue text-2xl">
            {procedure.Treatment.name}
          </Text>
          <Text className="font-semibold text-blackBlue text-lg">
            {new Date(procedure.registerDate).toLocaleDateString("es-BO")} -{" "}
            {procedure.updateDate
              ? new Date(procedure.updateDate).toLocaleDateString("es-BO")
              : "???"}
          </Text>
          <Text className="font-semibold text-blackBlue">
            {procedure.totalPieces} Pieza
            {procedure.totalPieces !== 1 ? "s" : ""} Dental
            {procedure.totalPieces !== 1 ? "es" : ""}
          </Text>
        </View>
      </View>
      <Link
        href={{
          pathname: "/treatmentDetails/[treatmentId]",
          params: { treatmentId: (procedure.Id ?? 0).toString() },
        }}
        asChild
      >
        <Pressable className="justify-center active:bg-pureBlue/50 px-3 rounded-r-lg min-h-20">
          <RightArrowIcon color="#02457A" size={36} />
        </Pressable>
      </Link>
    </View>
  );
}
