import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RightArrowIcon, ToothIcon } from "../Icons";

export default function TreatmentCard({
  treatmentId,
}: {
  treatmentId: string;
}) {
  return (
    <View className="flex-row bg-lightBlue rounded-lg">
      <View className="flex-row flex-1 items-center gap-1 p-1 my-2">
        <ToothIcon size={64} color="#02457A" />
        <View className="flex-1">
          <Text className="flex-1 min-h-8 font-extrabold text-blackBlue text-3xl">
            Ortodoncia
          </Text>
          <Text className="font-semibold text-blackBlue text-lg">
            10/04/25 - 29/04/25
          </Text>
          <Text className="font-semibold text-blackBlue">
            3 Piezas Dentales
          </Text>
        </View>
      </View>
      <Link
        href={{
          pathname: "/treatmentDetails/[treatmentId]",
          params: { treatmentId: treatmentId },
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
