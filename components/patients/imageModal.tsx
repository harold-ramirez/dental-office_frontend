import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ImagePlusIcon, RepeatIcon } from "../Icons";

export default function ImageModal({ onClose }: { onClose: () => void }) {
  const [newPhoto, setNewPhoto] = useState({
    photo: "",
    description: "",
  });
  const handleUploadPhoto = () => {
    onClose();
  };

  const uploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        //Save Image
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveImage = async (img: string) => {
    try {
      setNewPhoto({ ...newPhoto, photo: img });
    } catch (error) {
      throw error;
    }
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
      <View className="absolute justify-center items-center w-full h-full">
        <View className="items-center gap-5 bg-pureBlue -mt-28 p-5 rounded-xl w-11/12">
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
          <View
            style={{ overflow: "hidden" }}
            className={`justify-center border items-center size-80 border-whiteBlue border-dashed  ${
              newPhoto.photo === ""
                ? `border-4 rounded-3xl`
                : `w-full rounded-md`
            }`}
          >
            {newPhoto.photo === "" ? (
              <Pressable onPress={() => uploadImage()}>
                <ImagePlusIcon color="#D6E8EE" size={100} />
              </Pressable>
            ) : (
              <>
                <Image
                  source={{ uri: newPhoto.photo }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                  resizeMode="contain"
                />
                <Pressable
                  onPress={() => uploadImage()}
                  className="bottom-0 right-0 absolute justify-center items-center bg-blackBlue rounded-md size-10"
                >
                  <RepeatIcon color="#D6E8EE" size={24} />
                </Pressable>
              </>
            )}
          </View>

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
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
