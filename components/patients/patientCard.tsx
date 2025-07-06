import { Pressable, Text, View } from "react-native";
import { MedicalHistoryIcon, ProfileIcon, WhatsappIcon } from "../Icons";

export default function PatientCard() {
  return (
    <View className="bg-whiteBlue p-2 rounded-lg w-full">
      <View className="flex-row">
        <ProfileIcon size={70} />
        <View className="flex-1 ">
          <Text className="font-bold text-xl">Juan Gómez</Text>
          <Text>24 años</Text>
          <Text>M</Text>
          <Text>1234567 - 7654321</Text>
        </View>
      </View>
      <View className="flex-row w-full">
        <Pressable className="bg-darkBlue p-2 rounded-md size-8">
          <WhatsappIcon color="white" size={32} />
        </Pressable>
        <Pressable className="bg-darkBlue p-2 rounded-md size-8">
          <MedicalHistoryIcon color="white" size={32} />
        </Pressable>
        <Pressable className="bg-darkBlue p-2 rounded-md size-8">
          <ProfileIcon color="white" size={32} />
        </Pressable>
      </View>
    </View>
  );
}
