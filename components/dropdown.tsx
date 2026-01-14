import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function DropdownComponent({
  className,
  data,
  search,
  value,
  setValue,
}: {
  className?: string;
  data: { label: string; value: string }[];
  search?: boolean;
  value: string,
  setValue: (val: string) => void;
}) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View className={className}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#001B48" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={search ?? true}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Seleccionar" : "..."}
        searchPlaceholder="Buscar..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#D6E8EE",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: "center",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
