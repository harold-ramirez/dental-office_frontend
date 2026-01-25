import { ActivityIndicator, View } from "react-native";

interface LoadingProps {
  className: string;
  innerClassName: string;
  size?: number;
  color?: string;
}

export default function Loading(props: LoadingProps) {
  const { className, innerClassName, size, color } = props;
  return (
    <View className={className}>
      <View className={innerClassName}>
        <ActivityIndicator color={color ?? "#D6E8EE"} size={size ?? 50} />
      </View>
    </View>
  );
}
