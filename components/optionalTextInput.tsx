import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { CheckCircleIcon } from "./Icons";

interface OptionalTextInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  setValue: (val: string) => void;
}

export default function OptionalTextInput({
  placeholder,
  className,
  value,
  setValue,
}: OptionalTextInputProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEnabled) {
      inputRef.current?.focus();
    }
  }, [isEnabled]);

  return (
    <View
      className={`${className} flex-row justify-center bg-whiteBlue rounded-full  h-11 ${
        isEnabled ? `flex-1` : ``
      }`}
    >
      <Pressable
        onPress={() => {
          setIsEnabled(!isEnabled);
          setValue("");
        }}
        className={`rounded-full items-center justify-center size-11 ${
          isEnabled ? `bg-blackBlue` : `bg-whiteBlue`
        }`}
      >
        <CheckCircleIcon size={36} color={isEnabled ? `#D6E8EE` : `#001B48`} />
      </Pressable>
      <TextInput
        ref={inputRef}
        className={`flex-1 font-semibold text-blackBlue text-center ${
          isEnabled ? `flex` : `hidden`
        }`}
        editable={isEnabled}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />
    </View>
  );
}
