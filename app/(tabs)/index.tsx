import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, paddingHorizontal: 8 }}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl">Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}
