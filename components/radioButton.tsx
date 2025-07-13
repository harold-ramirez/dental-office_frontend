import { Pressable, Text, View } from "react-native";

export default function RadioButton({
  value,
  onChange,
}: {
  value: "M" | "F";
  onChange: (val: "M" | "F") => void;
}) {
  return (
    <View className="bg-whiteBlue border border-whiteBlue rounded-full w-24">
      <View
        style={{ backgroundColor: "rgba(2, 69, 122, 0.6)" }}
        className="flex-row justify-between items-center rounded-full"
      >
        <Pressable
          className={`flex-1 items-center py-1 rounded-full ${
            value === "M" ? "bg-blackBlue" : ""
          }`}
          onPress={() => onChange("M")}
        >
          <Text
            className={`font-bold ${
              value === "M" ? "text-white" : "text-blackBlue"
            }`}
          >
            M
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 items-center py-1 rounded-full ${
            value === "F" ? "bg-blackBlue" : ""
          }`}
          onPress={() => onChange("F")}
        >
          <Text
            className={`font-bold ${
              value === "F" ? "text-white" : "text-blackBlue"
            }`}
          >
            F
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
