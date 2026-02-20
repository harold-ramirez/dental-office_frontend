import Loading from "@/components/loading";
import { MedicalImageDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { Link, RelativePathString, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useToast } from "react-native-toast-notifications";
import {
  DeleteOutlineIcon,
  ImagePlusIcon,
  RepeatIcon,
  SaveIcon,
  XIcon,
} from "../Icons";
import { DeleteAlertMessage } from "../alertMessage";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ImageModalProps {
  onClose: () => void;
  image?: MedicalImageDto;
  patientId: number;
}

export default function ImageModal(props: ImageModalProps) {
  const { onClose, image, patientId } = props;
  const { logOut } = useContext(AuthContext);
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    imageID: image?.Id ?? 0,
    photoURL: image?.filename ? `${API_URL}/images/file/${image.filename}` : ``,
    description: image?.description ?? "",
    captureDate: image?.captureDate ? new Date(image.captureDate) : new Date(),
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
          toast.show(
            "La imagen es demasiado pesada. Elige una de menos de 5 MB o recorta la imagen",
            {
              type: "danger",
              placement: "top",
              duration: 3000,
            },
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
    } catch {
      toast.show("Error al seleccionar la imagen", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
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
      formData.append("Patient_Id", patientId.toString());
      await fetchWithToken(
        "/images",
        {
          method: "POST",
          body: formData,
        },
        logOut,
      );
      router.replace({
        pathname: "/medicalImages/[patientId]",
        params: {
          patientId: patientId.toString(),
          refresh: Date.now().toString(),
        },
      });
    } catch {
      toast.show("Error al subir la imagen", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateImage = async () => {
    try {
      setIsLoading(true);
      await fetchWithToken(
        `/images/${image?.Id.toString()}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            captureDate: newPhoto.captureDate.toISOString(),
            description: newPhoto.description,
            Patient_Id: patientId,
          }),
        },
        logOut,
      );
      router.replace({
        pathname: "/medicalImages/[patientId]",
        params: {
          patientId: patientId.toString(),
          refresh: Date.now().toString(),
        },
      });
    } catch {
      toast.show("Error al actualizar la imagen", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [onClose]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="absolute justify-center items-center bg-black/85 w-full h-full"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="w-full"
        scrollEnabled={true}
      >
        <View className="items-center w-full h-full">
          {/* Exit Button */}
          <View className="flex-row justify-end items-center my-2 w-full">
            <Pressable onPress={onClose} className="px-4 py-2">
              <XIcon color="#D6E8EE" size={24} />
            </Pressable>
          </View>
          {/* Content */}
          <View className="items-center gap-2 bg-lightBlue rounded-xl w-full">
            <View className="items-center gap-2 px-5 pt-5 w-full">
              {/* Image Preview/Placeholder */}
              <View
                style={{ overflow: "hidden" }}
                className={`justify-center items-center w-full min-h-80 border-darkBlue border-dashed ${
                  !image?.filename ? `border` : ``
                } ${
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
                    <Link
                      asChild
                      className="flex-1 w-full"
                      href={{
                        pathname: "/(protected)/fullScreenImage/[img]",
                        params: { img: newPhoto.photoURL },
                      }}
                    >
                      <Pressable>
                        <Image
                          source={{ uri: newPhoto.photoURL }}
                          resizeMode="contain"
                          className="w-full h-full"
                        />
                      </Pressable>
                    </Link>
                    {!image?.filename && (
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
                  maximumDate={new Date()}
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
                  disabled={isLoading || !!image?.filename}
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
                <Loading
                  className="flex-1"
                  innerClassName="w-full p-1 justify-center items-center"
                />
              ) : (
                <>
                  {/* Save Image Button */}
                  {!image?.filename && imageObject.uri && (
                    <Pressable
                      onPress={handleSaveImage}
                      className="flex-row flex-1 justify-center items-center gap-1 bg-darkBlue py-2 border-2 border-darkBlue rounded-b-xl"
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
                          "DELETE",
                          "/medicalImages/[patientId]" as RelativePathString,
                          logOut,
                          toast,
                          { patientId: patientId.toString() },
                        );
                      }}
                      className="flex-row flex-1 justify-center items-center py-1 border-darkBlue border-t-2 rounded-t-none"
                    >
                      <DeleteOutlineIcon color="#02457A" size={32} />
                      <Text className="font-bold text-darkBlue">
                        Eliminar Imagen
                      </Text>
                    </Pressable>
                  )}

                  {/* Update Image Button */}
                  {image && image?.description !== newPhoto.description && (
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
