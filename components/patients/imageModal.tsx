import Loading from "@/components/loading";
import { MedicalImageDto } from "@/interfaces/interfaces";
import * as ImagePicker from "expo-image-picker";
import { RelativePathString, useRouter } from "expo-router";
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
import DatePicker from "react-native-date-picker";
import {
  DeleteOutlineIcon,
  ImagePlusIcon,
  RepeatIcon,
  SaveIcon,
  XIcon,
} from "../Icons";
import { DeleteAlertMessage } from "../alertMessage";

interface ImageModalProps {
  onClose: () => void;
  image?: MedicalImageDto;
  patientId: number;
}

export default function ImageModal({ ...props }: ImageModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    imageID: props.image?.Id ?? 0,
    photoURL: props.image?.filepath ?? "",
    description: props.image?.description ?? "",
    captureDate: props.image?.captureDate
      ? new Date(props.image.captureDate)
      : new Date(),
  });
  const [imageObject, setImageObject] = useState({
    uri: "",
    type: "",
    name: "",
    size: 0,
  });
  const uploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          alert(
            "La imagen es demasiado pesada. Elige una de menos de 5 MB o recorta la imagen"
          );
          return;
        }
        setImageObject({
          uri: asset.uri,
          type: asset.mimeType ?? "image/jpeg",
          name: asset.fileName ?? "image.jpg",
          size: asset.fileSize
            ? Number((asset.fileSize / (1024 * 1024)).toFixed(2))
            : 0,
        });
        setNewPhoto({ ...newPhoto, photoURL: asset.uri });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Backend calls
  const handleSaveImage = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: imageObject.uri,
        name: imageObject.name,
        type: imageObject.type,
      } as any);
      formData.append("captureDate", newPhoto.captureDate.toISOString());
      formData.append("description", newPhoto.description);
      formData.append("Patient_Id", props.patientId.toString());
      formData.append("AppUser_Id", "1"); // Hardcoded
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (response.ok) {
        router.replace({
          pathname: "/medicalImages/[patientId]",
          params: {
            patientId: props.patientId.toString(),
            refresh: Date.now().toString(),
          },
        });
      } else {
      }
    } catch (e) {
      console.error("Error al subir la imagen:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateImage = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/images/${props.image?.Id.toString()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            captureDate: newPhoto.captureDate.toISOString(),
            description: newPhoto.description,
            Patient_Id: props.patientId,
            AppUser_Id: 1, // Hardcoded
          }),
        }
      );
      if (response.ok) {
        router.replace({
          pathname: "/medicalImages/[patientId]",
          params: {
            patientId: props.patientId.toString(),
            refresh: Date.now().toString(),
          },
        });
      } else {
      }
    } catch (e) {
      console.error("Error al actualizar la imagen:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        props.onClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [props.onClose]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/75 w-full h-full"
    >
      <View className="absolute justify-center items-center w-full h-full">
        <View className="items-center gap-2 bg-lightBlue -mt-28 rounded-xl w-11/12">
          <View className="items-center gap-2 px-5 pt-5 w-full">
            {/* Exit Button */}
            <View className="flex-row justify-end items-center w-full">
              <Pressable className="px-2 py-1 border border-darkBlue rounded-md">
                <XIcon color="#02457A" size={24} onPress={props.onClose} />
              </Pressable>
            </View>

            {/* Image Preview/Placeholder */}
            <View
              style={{ overflow: "hidden" }}
              className={`justify-center border items-center size-80 border-darkBlue border-dashed  ${
                newPhoto.photoURL === ""
                  ? `border-4 rounded-3xl`
                  : `w-full rounded-md`
              }`}
            >
              {newPhoto.photoURL === "" ? (
                <Pressable onPress={() => uploadImage()}>
                  <ImagePlusIcon color="#02457A" size={100} />
                </Pressable>
              ) : (
                <>
                  <Image
                    source={{ uri: newPhoto.photoURL }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                    resizeMode="contain"
                  />
                  {!props.image?.filepath && (
                    <Pressable
                      onPress={() => uploadImage()}
                      className="right-0 bottom-0 absolute justify-center items-center bg-blackBlue rounded-md size-10"
                    >
                      <RepeatIcon color="#D6E8EE" size={24} />
                    </Pressable>
                  )}
                </>
              )}
            </View>

            {/* Image Size */}
            <View>
              {imageObject.size !== 0 && (
                <Text>Tamaño: {imageObject.size} MB</Text>
              )}
            </View>

            {/* Capture Date */}
            <View className="flex-row justify-between items-center w-full">
              <Text className="w-1/2 font-bold text-darkBlue text-lg">
                FECHA DE CAPTURA:
              </Text>
              <DatePicker
                modal
                mode="date"
                open={showDatePicker}
                date={newPhoto.captureDate}
                onConfirm={(date) => {
                  setNewPhoto({ ...newPhoto, captureDate: date });
                  setShowDatePicker(false);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
              <Pressable
                className="bg-whiteBlue rounded-lg w-1/2"
                onPress={() => setShowDatePicker(true)}
                disabled={isLoading}
              >
                <Text className="text-blackBlue text-lg text-center">
                  {newPhoto.captureDate.toLocaleDateString("es-BO")}
                </Text>
              </Pressable>
            </View>

            {/* Photo Description */}
            <View className="w-full">
              <Text className="font-bold text-darkBlue text-lg">
                DESCRIPCIÓN:
              </Text>
              <TextInput
                multiline
                numberOfLines={5}
                readOnly={isLoading}
                value={newPhoto.description}
                onChangeText={(text) =>
                  setNewPhoto({ ...newPhoto, description: text })
                }
                style={{ textAlignVertical: "top" }}
                className="bg-whiteBlue rounded-lg w-full h-24 text-blackBlue"
              />
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row mt-5">
            {isLoading ? (
              <Loading className="flex-1" />
            ) : (
              <>
                {/* Save Image Button */}
                {!props.image?.filepath && imageObject.uri && (
                  <Pressable
                    onPress={handleSaveImage}
                    className="flex-row flex-1 justify-center items-center gap-1 py-2 bg-darkBlue border-2 border-darkBlue rounded-b-xl"
                  >
                    <SaveIcon color="#D6E8EE" size={24} />
                    <Text className="font-bold text-whiteBlue text-lg">
                      Guardar Imagen
                    </Text>
                  </Pressable>
                )}

                {/* Delete Image Button */}
                {newPhoto.photoURL !== "" && !imageObject.uri && (
                  <Pressable
                    onPress={() => {
                      DeleteAlertMessage(
                        "Confirmar Eliminación",
                        `¿Está seguro de eliminar la imagen?`,
                        "Eliminar",
                        `/images/${newPhoto.imageID}`,
                        "No se pudo eliminar la imagen. Inténtalo de nuevo.",
                        "/medicalImages/[patientId]" as RelativePathString,
                        { patientId: props.patientId.toString() }
                      );
                    }}
                    className="flex-row flex-1 justify-center items-center py-1 border-t-2 border-darkBlue rounded-t-none"
                  >
                    <DeleteOutlineIcon color="#02457A" size={32} />
                    <Text className="font-bold text-darkBlue">
                      Eliminar Imagen
                    </Text>
                  </Pressable>
                )}

                {/* Update Image Button */}
                {props.image &&
                  props.image?.description !== newPhoto.description && (
                    <Pressable
                      onPress={() => handleUpdateImage()}
                      className="flex-row flex-1 justify-center items-center gap-1 bg-darkBlue border-2 border-darkBlue rounded-br-xl"
                    >
                      <SaveIcon color="#D6E8EE" size={24} />
                      <Text className="font-semibold text-whiteBlue">
                        Guardar Cambios
                      </Text>
                    </Pressable>
                  )}
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
