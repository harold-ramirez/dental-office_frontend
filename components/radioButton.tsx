import { Pressable, Text, View } from "react-native";

export function GenderRadio({
  value,
  onChange,
}: {
  value: "M" | "F";
  onChange: (val: "M" | "F") => void;
}) {
  return (
    <View className="justify-center bg-whiteBlue border border-whiteBlue rounded-full w-24 h-10">
      <View
        style={{ backgroundColor: "rgba(2, 69, 122, 0.6)" }}
        className="flex-row justify-between items-center rounded-full h-9"
      >
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "M" ? "bg-darkBlue" : ""
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
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "F" ? "bg-darkBlue" : ""
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
    <View className="justify-center bg-whiteBlue border border-whiteBlue rounded-full w-24 h-10">
      <View
        style={{ backgroundColor: "rgba(2, 69, 122, 0.6)" }}
        className="flex-row justify-between items-center rounded-full h-9"
      >
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "Y" ? "bg-darkBlue" : ""
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
            value === "N" ? "bg-darkBlue" : ""
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

export function BannerModeRadio({
  editable,
  value,
  onChange,
}: {
  editable?: boolean;
  value: "Day" | "Week";
  onChange: (val: "Day" | "Week") => void;
}) {
  return (
    <View className="flex-1 justify-center bg-whiteBlue border border-whiteBlue rounded-full h-10">
      <View
        style={{ backgroundColor: "rgba(2, 69, 122, 0.6)" }}
        className="flex-row justify-between items-center rounded-full h-9"
      >
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "Day" ? "bg-darkBlue" : ""
          }`}
          onPress={() => onChange("Day")}
          disabled={!editable}
        >
          <Text
            className={`font-bold text-lg ${
              value === "Day" ? "text-white" : "text-darkBlue"
            }`}
          >
            Día
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 items-center justify-center py-1 h-9 rounded-full ${
            value === "Week" ? "bg-darkBlue" : ""
          }`}
          onPress={() => onChange("Week")}
          disabled={!editable}
        >
          <Text
            className={`font-bold text-lg ${
              value === "Week" ? "text-white" : "text-darkBlue"
            }`}
          >
            Semana
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
