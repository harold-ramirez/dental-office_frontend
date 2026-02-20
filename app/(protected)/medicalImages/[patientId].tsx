import { PlusIcon } from "@/components/Icons";
import ImageModal from "@/components/patients/imageModal";
import { MedicalImageDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MedicalImages() {
  const { patientId, refresh } = useLocalSearchParams();
  const { logOut, token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState<MedicalImageDto[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchAllPatientImages = useCallback(async () => {
    try {
      const endpoint = await fetchWithToken(
        `/images/${patientId}`,
        { method: "GET" },
        logOut,
      );
      setImages(endpoint);
    } catch (e) {
      console.error("Error fetching images:", e);
    }
  }, [patientId, logOut]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllPatientImages();
    setRefreshing(false);
  }, [fetchAllPatientImages]);

  useEffect(() => {
    onRefresh();
  }, [refresh, onRefresh]);

  return (
    <>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 8,
          alignItems: "center",
          backgroundColor: "#97CADB",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "Imágenes Médicas",
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-end w-full">
          {/* Image Gallery */}
          <ScrollView
            className="w-full"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="flex-row flex-wrap gap-3">
              {images.map((img) => (
                <Pressable
                  key={img.Id}
                  className="border"
                  onPress={() => {
                    setSelectedImage(img.Id);
                    setShowModal(true);
                  }}
                >
                  <Image
                    source={{
                      uri: `${API_URL}/images/file/${img.filename}`,
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }}
                    width={110}
                    height={110}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Upload new Image */}
          <Pressable
            onPress={() => {
              setSelectedImage(0);
              setShowModal(true);
            }}
            className="right-0 bottom-0 absolute justify-center items-center bg-darkBlue active:bg-blackBlue mr-3 mb-3 rounded-full size-20"
          >
            <PlusIcon color="#D6E8EE" size={46} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Image modal */}
      {showModal && (
        <ImageModal
          onClose={() => setShowModal(false)}
          image={images.find((img) => img.Id === selectedImage)}
          patientId={+patientId}
        />
      )}
    </>
  );
}
