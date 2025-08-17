import { Pressable, Text, View } from "react-native";

export function GenderRadio({
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

export function YesNoRadio({
  value,
  onChange,
}: {
  value: "Y" | "N";
  onChange: (val: "Y" | "N") => void;
}) {
  return (
    <View className="bg-whiteBlue justify-center border border-whiteBlue rounded-full h-10 w-24">
      <View
        style={{ backgroundColor: "rgba(2, 69, 122, 0.6)" }}
        className="flex-row justify-between items-center rounded-full h-9"
      >
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "Y" ? "bg-blackBlue" : ""
          }`}
          onPress={() => onChange("Y")}
        >
          <Text
            className={`font-bold text-lg ${
              value === "Y" ? "text-white" : "text-blackBlue"
            }`}
          >
            SI
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "N" ? "bg-blackBlue" : ""
          }`}
          onPress={() => onChange("N")}
        >
          <Text
            className={`font-bold text-lg ${
              value === "N" ? "text-white" : "text-blackBlue"
            }`}
          >
            NO
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
