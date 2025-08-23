import { ImageIcon, PlusIcon } from "@/components/Icons";
import ImageModal from "@/components/patients/imageModal";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicalImages() {
  const { patientId } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);

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
        <View className="flex-1 items-end bg-pureBlue p-2 rounded-xl w-full">
          <ScrollView className="w-full">
            <View className="flex-row flex-wrap">
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21,
              ].map((item) => (
                <Pressable key={item} className="">
                  <ImageIcon color="#D6E8EE" size={115} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Pressable
            onPress={() => setShowModal(true)}
            className="right-0 bottom-0 absolute justify-center items-center bg-darkBlue active:bg-blackBlue mr-3 mb-3 rounded-full size-20"
          >
            <PlusIcon color="#D6E8EE" size={46} />
          </Pressable>
        </View>
      </SafeAreaView>
      {showModal && <ImageModal onClose={() => setShowModal(false)} />}
    </>
  );
}
