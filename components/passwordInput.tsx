import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { EyeIcon, EyeSlashIcon, LockIcon } from "./Icons";

interface PasswordInputProps {
  value: string;
  setValue: (val: string) => void;
  disabled: boolean;
  className?: string;
  placeholder: string;
}

export default function PasswordInput(props: PasswordInputProps) {
  const { value, setValue, disabled, className, placeholder } = props;
  const [peekPassword, setPeekPassword] = useState(false);

  return (
    <View
      className={
        className ?? "flex-row items-center gap-1 bg-whiteBlue rounded-lg h-12"
      }
    >
      <LockIcon color="#001B48" size={28} className="pl-2" />
      <TextInput
        className="flex-1 text-blackBlue"
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        secureTextEntry={!peekPassword}
        value={value}
        onChangeText={setValue}
        editable={!disabled}
      />
      <Pressable
        className="justify-center items-center p-1 h-full"
        onPress={() => setPeekPassword(!peekPassword)}
        disabled={disabled}
      >
        {peekPassword ? (
          <EyeIcon color="#999999" size={16} />
        ) : (
          <EyeSlashIcon color="#999999" size={16} />
        )}
      </Pressable>
    </View>
  );
}
