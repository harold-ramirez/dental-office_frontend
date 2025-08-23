import { useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ImagePlusIcon } from "../Icons";

export default function ImageModal({ onClose }: { onClose: () => void }) {
  const [newPhoto, setNewPhoto] = useState({
    photo: "",
    description: "",
  });
  const handleUploadPhoto = () => {
    onClose();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [onClose]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/75 w-full h-full"
    >
      <Pressable
        onPress={onClose}
        className="absolute justify-center items-center w-full h-full"
      >
        <Pressable
          onPress={() => {}}
          className="items-center gap-5 bg-pureBlue -mt-28 p-5 rounded-xl w-11/12"
        >
          {/* Upload Button */}
          <View className="items-end w-full">
            <Pressable
              onPress={handleUploadPhoto}
              className="justify-center items-center bg-blackBlue active:bg-darkBlue px-3 py-1 border-2 border-whiteBlue rounded-lg"
            >
              <Text className="font-bold text-whiteBlue text-lg">
                Subir Imagen
              </Text>
            </Pressable>
          </View>

          {/* Image Preview/Placeholder */}
          <Pressable className="justify-center items-center border-4 border-whiteBlue border-dashed rounded-3xl size-80">
            <ImagePlusIcon color="#D6E8EE" size={100} />
          </Pressable>

          {/* Photo Description */}
          <View className="w-full">
            <Text className="font-bold text-whiteBlue text-lg">
              DESCRIPCIÓN:
            </Text>
            <TextInput
              multiline
              numberOfLines={5}
              value={newPhoto.description}
              onChangeText={(text) =>
                setNewPhoto({ ...newPhoto, description: text })
              }
              style={{ textAlignVertical: "top" }}
              className="bg-whiteBlue rounded-lg w-full h-24 text-blackBlue"
            />
          </View>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
