import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

// Convertimos Path a un componente animado
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ArcProps {
  number: number;
  text: string;
  width?: number;
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  duration?: number;
  delay?: number;
}

export default function AnimatedArc(props: ArcProps) {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    const length = 350;
    return {
      strokeDasharray: [length, length],
      strokeDashoffset: length * (1 - progress.value),
    };
  });

  useEffect(() => {
    progress.value = withDelay(
      props.delay ? props.delay : 500,
      withTiming(1, {
        duration: props.duration ? props.duration : 1500,
        easing: Easing.out(Easing.ease),
      })
    );
  }, []);

  return (
    <View className="items-center justify-end">
      <Svg width="240" height="150" viewBox="15 -15 200 150">
        {/* Border Arc */}
        <AnimatedPath
          d="M20,120 A100,100 0 1,1 218,120"
          stroke={props.borderColor ? props.borderColor : "#D6E8EE"}
          strokeWidth={props.borderWidth ? props.borderWidth : "25"}
          fill="transparent"
          strokeLinecap="round"
          // animatedProps={animatedProps}
        />

        {/* Fill Arc */}
        <AnimatedPath
          d="M20,120 A100,100 0 1,1 218,120"
          stroke={props.color ? props.color : "#02457A"}
          strokeWidth={props.width ? props.width : "22"}
          fill="transparent"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>

      <View className="absolute items-center mb-3">
        <Text style={{ fontSize: 50 }} className="font-bold text-whiteBlue">
          {props.number}
        </Text>
        <Text className="text-whiteBlue text-center">{props.text}</Text>
      </View>
    </View>
  );
}
