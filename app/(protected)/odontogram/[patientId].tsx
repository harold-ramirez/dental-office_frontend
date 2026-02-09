/* eslint-disable react/no-unknown-property */
import adultmodelPath from "@/assets/models/Adult_Denture.glb";
import childmodelPath from "@/assets/models/Child_Denture.glb";
import Model from "@/components/Model";
import SingleToothModel from "@/components/SingleToothModel"; // Import SingleToothModel
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { translateFace } from "@/utils/faceDictionary"; // Import face translator
import { TOOTH_ASSETS } from "@/utils/toothAssets"; // Import TOOTH_ASSETS
import { Center, Environment, OrbitControls } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Odontogram() {
  const { patientId } = useLocalSearchParams();
  const [isAdultModel, setIsAdultModel] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [singleToothUri, setSingleToothUri] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const { logOut } = useContext(AuthContext);

  const [odontograms, setOdontograms] = useState<
    {
      Id: number;
      model: string;
      registerDate: string;
      updateDate: string;
      tooth: {
        Id: number;
        pieceNumber: number;
        localStatus: string;
        toothsection: {
          Id: number;
          name: string;
          localStatus: string;
        }[];
      }[];
    }[]
  >([]);
  const [currentOdontogram, setCurrentOdontogram] = useState<{
    Id: number;
    model: string;
    registerDate: string;
    updateDate: string;
    tooth: {
      Id: number;
      pieceNumber: number;
      localStatus: string;
      toothsection: {
        Id: number;
        name: string;
        localStatus: string;
      }[];
    }[];
  }>({
    Id: 0,
    model: "",
    registerDate: "",
    updateDate: "",
    tooth: [],
  });
  const [currentModelUri, setCurrentModelUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showRoots, setShowRoots] = useState(false);

  const { height } = useWindowDimensions();
  const ODONTOGRAM_HEIGHT = height - 200;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const odontogramAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-ODONTOGRAM_HEIGHT, 0, ODONTOGRAM_HEIGHT],
            [-ODONTOGRAM_HEIGHT / 2, 0, ODONTOGRAM_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-ODONTOGRAM_HEIGHT, 0, ODONTOGRAM_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  useEffect(() => {
    const fetchOdontograms = async () => {
      try {
        const response = await fetchWithToken(
          `/odontograms/${patientId}`,
          { method: "GET" },
          logOut,
        );
        setOdontograms(response);
        setCurrentOdontogram(response[0]);
        setIsAdultModel(response[0].model === "adult");
        if (response[0].model === "adult") setCurrentModelUri(adultmodelPath);
        else setCurrentModelUri(childmodelPath);
      } catch (e) {
        console.log("Error fetching odontograms", e);
      }
    };
    fetchOdontograms();
  }, [logOut, patientId]);

  useEffect(() => {
    (async () => {
      try {
        if (isAdultModel) {
          const adultAsset = Asset.fromModule(adultmodelPath);
          await adultAsset.downloadAsync();
          setCurrentModelUri(adultAsset.uri);
        } else {
          const childAsset = Asset.fromModule(childmodelPath);
          await childAsset.downloadAsync();
          setCurrentModelUri(childAsset.uri);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error loading asset");
        console.error(e);
      }
    })();
  }, [isAdultModel]);

  useEffect(() => {
    const loadSingleTooth = async () => {
      if (!selectedTooth) {
        setSingleToothUri(null);
        return;
      }

      const assetModule = TOOTH_ASSETS[selectedTooth];
      if (assetModule) {
        try {
          const asset = Asset.fromModule(assetModule);
          await asset.downloadAsync();
          setSingleToothUri(asset.uri);
          setSelectedFace(null); // Reset selected face when tooth changes
        } catch (e) {
          console.error("Failed loading single tooth", e);
          setSingleToothUri(null);
        }
      } else {
        setSingleToothUri(null);
      }
    };
    loadSingleTooth();
  }, [selectedTooth]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <>
      <LinearGradient
        colors={["#97CADB", "#018ABE", "#97CADB"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView edges={["left", "right", "bottom"]}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "Odontograma",
            headerRight: () => <></>,
          }}
        />
        <Animated.ScrollView ref={scrollRef} className="w-full">
          <View className="flex-1 w-full">
            {/* 3D Odontogram */}
            <Animated.View
              style={[{ height: ODONTOGRAM_HEIGHT }, odontogramAnimationStyle]}
              className="w-full"
            >
              {!currentModelUri ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="blue" />
                  <Text>Cargando modelo...</Text>
                </View>
              ) : (
                <>
                  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <color attach="background" args={["#076082"]} />
                    {/* Usamos Environment para materiales metálicos y ambientLight para relleno */}
                    <ambientLight intensity={1.5} />
                    <Environment preset="city" />
                    <Suspense fallback={null}>
                      <group position={[0, -2.25, 0]}>
                        <Center top>
                          <Model
                            uri={currentModelUri}
                            scale={4}
                            isOpen={isOpen}
                            showRoots={showRoots}
                            onToothSelect={setSelectedTooth}
                          />
                        </Center>
                      </group>
                    </Suspense>
                    <OrbitControls makeDefault />
                    {/* <gridHelper args={[10, 10]} /> */}
                    {/* <axesHelper args={[2]} /> */}
                  </Canvas>
                  {/* Model Text */}
                  <View className="top-0 absolute self-center gap-2 bg-blackBlue/75 p-2 w-full">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row gap-1">
                        {odontograms.map((odontogram, i) => (
                          <Pressable
                            key={i}
                            onPress={() => setCurrentOdontogram(odontogram)}
                            className={`px-4 py-1 rounded-t-lg ${currentOdontogram.Id === odontogram.Id ? `bg-whiteBlue` : `bg-darkBlue`}`}
                          >
                            <Text
                              className={`${currentOdontogram.Id === odontogram.Id ? `text-darkBlue` : `text-whiteBlue`}`}
                            >
                              {new Date(
                                odontogram.registerDate,
                              ).toLocaleDateString("es-BO", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </ScrollView>
                    <Text className="font-bold text-whiteBlue text-center">
                      Modelo: {isAdultModel ? "Adulto" : "Niño"}
                    </Text>
                  </View>
                  {/* Botón flotante para abrir/cerrar boca */}
                  <View className="bottom-5 absolute flex-row self-center gap-1 bg-darkBlue/75 p-1 rounded-xl">
                    <Pressable
                      onPress={() => setIsOpen(!isOpen)}
                      className="bg-lightBlue px-4 py-2 rounded-l-lg active:bg-whiteBlue"
                    >
                      <Text className="text-blackBlue">
                        {isOpen ? "Cerrar Boca" : "Abrir Boca"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowRoots(!showRoots)}
                      className="bg-lightBlue px-4 py-2 rounded-r-lg active:bg-whiteBlue"
                    >
                      <Text className="text-blackBlue">
                        {showRoots ? "Ocultar Raíces" : "Ver Raíces"}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </Animated.View>

            {/* Content */}
            <View className="items-center bg-whiteBlue px-1 py-3 rounded-t-2xl w-full min-h-24">
              <View className="mb-3 border-2 border-stone-400 rounded-full w-1/5" />
              {/* Dental Piece Number */}
              <Text className="font-bold text-xl">
                {selectedTooth
                  ? "Pieza Dental " + selectedTooth.split("_")[1]
                  : "Seleccione una pieza dental"}
              </Text>

              {/* Single Tooth View */}
              {selectedTooth && singleToothUri && (
                <View className="items-center bg-gray-200 my-4 rounded-lg w-full h-52 overflow-hidden">
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    style={{ flex: 1, width: "100%" }}
                  >
                    <color attach="background" args={["#076082"]} />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 10, 5]} intensity={0.5} />
                    <directionalLight position={[-5, 10, -5]} intensity={0.5} />
                    <Environment preset="city" />
                    <Suspense fallback={null}>
                      <Center>
                        <SingleToothModel
                          uri={singleToothUri}
                          scale={9}
                          onFaceSelect={setSelectedFace}
                        />
                      </Center>
                    </Suspense>
                    <OrbitControls makeDefault />
                  </Canvas>
                </View>
              )}

              {/* Selected Tooth Face */}
              {selectedTooth && singleToothUri && (
                <View className="bg-blackBlue/75 mb-2 px-3 py-1 rounded-lg">
                  <Text className={`font-bold text-whiteBlue ${!selectedFace ? `italic`:``}`}>
                    {selectedFace
                      ? translateFace(selectedFace)
                      : "Seleccione una cara del diente"}
                  </Text>
                </View>
              )}

              {/* Markup Legend */}
              {selectedTooth && singleToothUri && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 mb-2 p-2 rounded-lg">
                    <Pressable
                      onPress={() => {}}
                      className="bg-green-700 active:bg-green-600 px-4 py-2 rounded-md"
                    >
                      <Text className="text-whiteBlue">
                        Prótesis Maladaptada
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {}}
                      className="bg-gray-700 active:bg-gray-600 px-4 py-2 rounded-md"
                    >
                      <Text className="text-whiteBlue">Diente Ausente</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {}}
                      disabled={selectedFace === null}
                      className="bg-red-700 active:bg-red-600 px-4 py-2 rounded-md"
                    >
                      <Text className="text-whiteBlue">Cáries / LC</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {}}
                      className="bg-blue-700 active:bg-blue-600 px-4 py-2 rounded-md"
                    >
                      <Text className="text-whiteBlue">Implante</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              )}
              {/* Update Date */}
              {currentOdontogram.updateDate && (
                <Text>
                  Actualizado el{" "}
                  {new Date(currentOdontogram.updateDate).toLocaleDateString(
                    "es-BO",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </Text>
              )}
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
}
