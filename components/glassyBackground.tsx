import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue } from "react-native";

interface GlassyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  color1?: ColorValue;
  color2?: ColorValue;
}

export default function GlassyBackground({ ...props }: GlassyBackgroundProps) {
  return (
    <LinearGradient
      className={`${
        !props.className?.includes("border") && `border border-whiteBlue/30`
      } ${props.className}`}
      colors={[props.color1 ?? "#00000022", props.color2 ?? "#00000033"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 12,
      }}
    >
      {props.children}
    </LinearGradient>
  );
}
