import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { CheckCircleIcon } from "./Icons";

interface OptionalTextInputProps {
  placeholder?: string;
  className?: string;
  isReadOnly?: boolean;
  value: string;
  setValue: (val: string) => void;
}

export default function OptionalTextInput({
  placeholder,
  className,
  isReadOnly = false,
  value,
  setValue,
}: OptionalTextInputProps) {
  const [isExpanded, setIsExpanded] = useState(isReadOnly && value !== "");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  return (
    <View
      className={`${className} flex-row justify-center bg-whiteBlue rounded-full  h-11 ${
        isExpanded ? `flex-1` : ``
      }`}
    >
      <Pressable
        disabled={isReadOnly && value !== ""}
        onPress={() => {
          setIsExpanded(!isExpanded);
          setValue("");
        }}
        className={`rounded-full items-center justify-center size-11 ${
          isExpanded ? `bg-blackBlue` : `bg-whiteBlue`
        }`}
      >
        <CheckCircleIcon size={36} color={isExpanded ? `#D6E8EE` : `#001B48`} />
      </Pressable>
      <TextInput
        ref={inputRef}
        className={`flex-1 font-semibold text-blackBlue text-center ${
          isExpanded ? `flex` : `hidden`
        }`}
        editable={isExpanded}
        readOnly={isReadOnly}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />
    </View>
  );
}
