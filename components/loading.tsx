import { ActivityIndicator, View } from "react-native";

interface LoadingProps {
  className?: string;
  size?: number;
  color?: string;
  bgColor?: string;
}

export default function Loading({ ...props }: LoadingProps) {
  return (
    // top-0 right-0 bottom-0 left-0 absolute justify-center items-center bg-blackBlue/25
    <View className={props.className}>
      <View
        className={`w-full p-1 justify-center items-center ${
          props.bgColor ?? "bg-blackBlue/75"
        }`}
      >
        <ActivityIndicator
          color={props.color ?? "#D6E8EE"}
          size={props.size ?? 50}
        />
      </View>
    </View>
  );
}
