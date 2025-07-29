import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center bg-blackBlue/25">
      <View className="justify-center items-center gap-2 bg-blackBlue/75 rounded-xl size-28">
        <ActivityIndicator color={"#D6E8EE"} size={50} />
      </View>
    </View>
  );
}
