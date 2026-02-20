/* eslint-disable react/no-unknown-property */
import adultmodelPath from "@/assets/models/Adult_Denture.glb";
import childmodelPath from "@/assets/models/Child_Denture.glb";
import Model from "@/components/Model";
import SingleToothModel from "@/components/SingleToothModel"; // Import SingleToothModel
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { translateFace } from "@/utils/faceDictionary"; // Import face translator
import { getStatusColor, getStatusDescription } from "@/utils/statusColors"; // Import status descriptions
import { TOOTH_ASSETS } from "@/utils/toothAssets";
import { Center, Environment, OrbitControls } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useToast } from "react-native-toast-notifications";

export default function Odontogram() {
  const { patientId } = useLocalSearchParams();
  const [isAdultModel, setIsAdultModel] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [singleToothUri, setSingleToothUri] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [availableFaces, setAvailableFaces] = useState<string[]>([]); // Caras disponibles del diente seleccionado
  const [changes, setChanges] = useState<Record<string, string>>({}); // Cambios locales
  const { logOut } = useContext(AuthContext);
  const toast = useToast();

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

  // Reset changes whenever current odontogram changes
  useEffect(() => {
    setChanges({});
  }, [currentOdontogram.Id]);

  // Determine if editable (most recent)
  const isEditable = useMemo(() => {
    if (odontograms.length === 0) return true; // Si es el único, es editable
    // El array viene ordenado del más reciente al más antiguo (index 0 es el último)
    const newestOdontogram = odontograms[0];
    return currentOdontogram.Id === newestOdontogram.Id;
  }, [odontograms, currentOdontogram.Id]);

  // Compute Merged Odontogram for Display
  const mergedOdontogram = useMemo(() => {
    if (Object.keys(changes).length === 0) return currentOdontogram;

    // Deep clone to avoid mutating state directly
    const cloned = JSON.parse(JSON.stringify(currentOdontogram));

    // Apply changes
    // Change Key format: `${pieceNumber}_${faceName}`
    cloned.tooth.forEach((t: any) => {
      t.toothsection.forEach((s: any) => {
        const key = `${t.pieceNumber}_${s.name}`;
        if (changes[key] !== undefined) {
          s.localStatus = changes[key];
        }
      });
    });
    return cloned;
  }, [currentOdontogram, changes]);

  const handleStatusChange = (status: string) => {
    if (!isEditable || !selectedTooth) return;

    const toothNumStr = selectedTooth.split("_")[1];
    const tooth = currentOdontogram.tooth.find(
      (t) => t.pieceNumber.toString() === toothNumStr,
    );
    if (!tooth) return;

    const newChanges = { ...changes };

    if (status === "black") {
      // Diente Ausente: Aplica a TODO el diente

      // Verificamos si ya está todo marcado como Ausente (en changes) para hacer Toggle Off
      const allSectionsBlack = tooth.toothsection.every(
        (s) => newChanges[`${toothNumStr}_${s.name}`] === "black",
      );

      tooth.toothsection.forEach((section) => {
        const key = `${toothNumStr}_${section.name}`;
        if (allSectionsBlack) {
          // Revertir (quitar cambios)
          delete newChanges[key];
        } else {
          // Aplicar Black (solo si es diferente del original, sino borra cambio)
          if (section.localStatus === "black") {
            delete newChanges[key];
          } else {
            newChanges[key] = "black";
          }
        }
      });
    } else {
      // Caries (red), Implante (blue), Prótesis (green), Sano (white)
      // Solo aplica a la cara seleccionada
      if (!selectedFace) {
        // Obtenemos description para el alert
        const desc = getStatusDescription(status) || "el estado";
        toast.show(
          `Por favor seleccione una cara específica para marcar ${desc}.`,
          {
            type: "danger",
            placement: "top",
            duration: 3000,
          },
        );
        return;
      }

      // Validar caso "Recuperar de Ausente":
      // Si alguna OTRA cara está en estado "black" (Ausente), debemos pasarla a "white" (Sano)
      // para que el diente deje de verse "ausente" y se vea el implante/prótesis/caries.
      tooth.toothsection.forEach((s) => {
        const key = `${toothNumStr}_${s.name}`;
        const currentStatusInChanges = newChanges[key];
        // Nota: usamos newChanges para ver estado acumulado o s.localStatus.
        // Mejor miramos mergedOdontogram pero ya tenemos 'newChanges' copia.
        // Simplificación: Si el change actual es 'black' o el original es 'black' y no hay change...
        const activeStatus =
          currentStatusInChanges !== undefined
            ? currentStatusInChanges
            : s.localStatus;

        if (s.name !== selectedFace) {
          if (activeStatus === "black") {
            // Forzamos a white para "aparecer" el diente
            if (s.localStatus === "white") {
              delete newChanges[key];
            } else {
              newChanges[key] = "white";
            }
          }
        }
      });

      // Ahora aplicamos el estado a la cara seleccionada
      const key = `${toothNumStr}_${selectedFace}`;
      const section = tooth.toothsection.find((s) => s.name === selectedFace);
      const originalStatus = section?.localStatus; // safe access

      // Toggle logic
      const currentChange = newChanges[key];
      if (currentChange === status) {
        // Si ya estaba marcado así en changes -> Quitar (revertir a original)
        delete newChanges[key];
      } else {
        // Aplicar nuevo estado
        // Si el nuevo estado es igual al original -> Quitar entry de changes
        if (originalStatus === status) {
          delete newChanges[key];
        } else {
          newChanges[key] = status;
        }
      }
    }

    setChanges(newChanges);
  };

  const { height } = useWindowDimensions();
  const ODONTOGRAM_HEIGHT = height - 200;

  // Helpers para clasificar dientes
  const { upper, lower } = useMemo(() => {
    if (!mergedOdontogram || !mergedOdontogram.tooth)
      return { upper: [], lower: [] };

    const teeth = [...mergedOdontogram.tooth];

    const upperRight = teeth.filter((t) => {
      const q = Math.floor(t.pieceNumber / 10);
      return q === 1 || q === 5;
    });
    const upperLeft = teeth.filter((t) => {
      const q = Math.floor(t.pieceNumber / 10);
      return q === 2 || q === 6;
    });

    const lowerRight = teeth.filter((t) => {
      const q = Math.floor(t.pieceNumber / 10);
      return q === 4 || q === 8;
    });
    const lowerLeft = teeth.filter((t) => {
      const q = Math.floor(t.pieceNumber / 10);
      return q === 3 || q === 7;
    });

    upperRight.sort((a, b) => b.pieceNumber - a.pieceNumber);
    upperLeft.sort((a, b) => a.pieceNumber - b.pieceNumber);
    lowerRight.sort((a, b) => b.pieceNumber - a.pieceNumber);
    lowerLeft.sort((a, b) => a.pieceNumber - b.pieceNumber);

    return {
      upper: [...upperRight, ...upperLeft],
      lower: [...lowerRight, ...lowerLeft],
    };
  }, [mergedOdontogram]);

  const handleToothButtonSelect = (pieceNumber: number) => {
    const toothName = `Tooth_${pieceNumber}`;
    setSelectedTooth(toothName);
  };

  // Render Item para la lista de botones
  const renderToothButton = (t: any) => {
    const isSelected = selectedTooth?.includes(t.pieceNumber.toString());
    let buttonColorClass = "bg-white border-gray-300";
    let textColorClass = "text-gray-700";
    if (isSelected) {
      buttonColorClass = "bg-blue-600 border-blue-800";
      textColorClass = "text-white font-bold";
    }

    return (
      <Pressable
        key={t.Id}
        onPress={() => handleToothButtonSelect(t.pieceNumber)}
        className={`mx-1 w-10 h-10 justify-center items-center rounded-full border ${buttonColorClass}`}
      >
        <Text className={`${textColorClass}`}>{t.pieceNumber}</Text>
      </Pressable>
    );
  };

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

  const handleupdateOdontogram = async (apiPayload: any[]) => {
    try {
      await fetchWithToken(
        `/odontograms/${currentOdontogram.Id}`,
        { method: "PATCH", body: JSON.stringify(apiPayload, null, 2) },
        logOut,
      );
      toast.show("Los cambios se guardaron exitosamente", {
        type: "success",
        placement: "top",
        duration: 3000,
      });
      setChanges({});
      const response = await fetchWithToken(
        `/odontograms/${patientId}`,
        { method: "GET" },
        logOut,
      );
      setOdontograms(response);
      setCurrentOdontogram(response[0]);
      setIsAdultModel(response[0].model === "adult");
    } catch {
      toast.show(
        "Hubo un error al actualizar el odontograma, inténtelo de nuevo",
        {
          type: "danger",
          placement: "top",
          duration: 3000,
        },
      );
    }
  };

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
      } catch {}
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
          setAvailableFaces([]);
        } catch {
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

  const getFaceValues = (faceName: string | null) => {
    if (!faceName || !mergedOdontogram || !selectedTooth) return null;
    const toothNumStr = selectedTooth.split("_")[1];
    const tooth = mergedOdontogram.tooth?.find(
      (t: any) => t.pieceNumber.toString() === toothNumStr,
    );
    if (!tooth) return null;
    const section = tooth.toothsection?.find((s: any) => s.name === faceName);

    return section ? getStatusDescription(section.localStatus) : "";
  };

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
            headerRight: () =>
              Object.keys(changes).length > 0 && isEditable ? (
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Confirmar cambios",
                      "¿Está seguro de que desea guardar los cambios en el odontograma?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Guardar",
                          onPress: () => {
                            // Start of change: Transform 'changes' to API payload
                            const payload = Object.entries(changes)
                              .map(([key, newStatus]) => {
                                const [pieceNumStr, ...rest] = key.split("_");
                                // Re-join the rest in case the face name contains underscores, though simple split is usually enough
                                const faceName = rest.join("_");

                                const tooth = currentOdontogram.tooth.find(
                                  (t) =>
                                    t.pieceNumber.toString() === pieceNumStr,
                                );
                                const section = tooth?.toothsection.find(
                                  (s) => s.name === faceName,
                                );

                                if (section) {
                                  return {
                                    toothSectionId: section.Id,
                                    localStatus: newStatus,
                                  };
                                }
                                return null;
                              })
                              .filter(Boolean); // Filter out any nulls if lookup failed

                            handleupdateOdontogram(payload);
                          },
                        },
                      ],
                    );
                  }}
                  className="bg-white/20 active:bg-white/30 mr-2 px-3 py-1 rounded"
                >
                  <Text className="font-bold text-white">Guardar</Text>
                </Pressable>
              ) : null,
          }}
        />
        <Animated.ScrollView ref={scrollRef} className="w-full">
          <View className="flex-1 w-full">
            {/* 3D Space */}
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
                  {/* Rendering Space */}
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
                            odontogram={mergedOdontogram} // Pasamos el odontograma completo
                            onToothSelect={setSelectedTooth}
                            selectedToothName={selectedTooth} // Pasamos la selección para sincronización Bidireccional
                          />
                        </Center>
                      </group>
                    </Suspense>
                    <OrbitControls makeDefault />
                  </Canvas>

                  {/* Model Text */}
                  <View className="top-0 absolute self-center bg-blackBlue/75 w-full">
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
                              className={`${currentOdontogram.Id === odontogram.Id ? `text-darkBlue font-bold` : `text-whiteBlue`}`}
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
                    <Text className="py-2 font-bold text-whiteBlue text-center">
                      Modelo: {isAdultModel ? "Adulto" : "Niño"}
                    </Text>
                    {/* ScrollView Dientes Superiores (Arcada Superior) */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <View className="flex-row w-full h-14">
                        {upper.map(renderToothButton)}
                      </View>
                    </ScrollView>
                  </View>

                  {/* Botón flotante para abrir/cerrar boca */}
                  <View className="bottom-0 absolute items-center self-center gap-2">
                    <View className="flex-row gap-1 bg-darkBlue/75 p-1 rounded-xl">
                      <Pressable
                        onPress={() => setIsOpen(!isOpen)}
                        className="bg-lightBlue active:bg-whiteBlue px-4 py-2 rounded-l-lg"
                      >
                        <Text className="text-blackBlue">
                          {isOpen ? "Cerrar Boca" : "Abrir Boca"}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setShowRoots(!showRoots)}
                        className="bg-lightBlue active:bg-whiteBlue px-4 py-2 rounded-r-lg"
                      >
                        <Text className="text-blackBlue">
                          {showRoots ? "Ocultar Raíces" : "Ver Raíces"}
                        </Text>
                      </Pressable>
                    </View>
                    {/* ScrollView Dientes Inferiores (Arcada Inferior) */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <View className="flex-row w-full h-14">
                        {lower.map(renderToothButton)}
                      </View>
                    </ScrollView>
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
                <View className="flex-row justify-between items-center my-4 w-full h-52">
                  {/* ScrollView de Botones de selección de cara */}
                  <View className="bg-slate-100 p-1 border border-gray-300 border-r-0 rounded-l-lg w-1/3 h-full">
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                    >
                      {availableFaces.length > 0 ? (
                        availableFaces.map((faceName) => {
                          const toothData = mergedOdontogram?.tooth?.find(
                            (t: any) =>
                              t.pieceNumber.toString() ===
                              selectedTooth.split("_")[1],
                          );
                          const section = toothData?.toothsection?.find(
                            (s: any) => s.name === faceName,
                          );
                          const faceColor = section
                            ? getStatusColor(section.localStatus)
                            : null;

                          return (
                            <Pressable
                              key={faceName}
                              style={
                                faceColor
                                  ? {
                                      borderLeftColor: faceColor,
                                      borderLeftWidth: 6,
                                    }
                                  : {
                                      borderLeftWidth: 6,
                                      borderLeftColor: "#e5e7eb",
                                    }
                              }
                              onPress={() =>
                                setSelectedFace(
                                  selectedFace === faceName ? null : faceName,
                                )
                              }
                              className={`mb-2 py-2 px-1 rounded-r border-y border-r ${
                                selectedFace === faceName
                                  ? "bg-blue-600 border-blue-800"
                                  : "bg-white border-gray-300 active:bg-gray-100"
                              }`}
                            >
                              <Text
                                className={`text-xs text-center flex-wrap ${
                                  selectedFace === faceName
                                    ? "text-white font-bold"
                                    : "text-gray-700"
                                }`}
                              >
                                {translateFace(faceName).replace("Cara ", "") ||
                                  faceName}
                              </Text>
                            </Pressable>
                          );
                        })
                      ) : (
                        <View className="items-center mt-4">
                          <ActivityIndicator size="small" color="#000" />
                          <Text className="mt-1 text-[10px] text-gray-500 text-center">
                            Cargando partes...
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>

                  {/* Visor 3D */}
                  <View className="flex-1 bg-gray-200 border border-gray-300 rounded-r-lg h-full overflow-hidden">
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      style={{ flex: 1, width: "100%" }}
                    >
                      <color attach="background" args={["#076082"]} />
                      <ambientLight intensity={0.7} />
                      <directionalLight position={[5, 10, 5]} intensity={0.5} />
                      <directionalLight
                        position={[-5, 10, -5]}
                        intensity={0.5}
                      />
                      <Environment preset="city" />
                      <Suspense fallback={null}>
                        <Center>
                          <SingleToothModel
                            uri={singleToothUri}
                            scale={9}
                            // Encontramos la data específica de este diente en el odontograma actual
                            toothData={mergedOdontogram?.tooth?.find(
                              (t: any) =>
                                t.pieceNumber.toString() ===
                                selectedTooth.split("_")[1],
                            )}
                            onFaceSelect={setSelectedFace}
                            selectedFaceName={selectedFace}
                            onLoadedFaces={setAvailableFaces}
                          />
                        </Center>
                      </Suspense>
                      <OrbitControls makeDefault />
                    </Canvas>
                  </View>
                </View>
              )}

              {/* Selected Tooth Face */}
              {selectedTooth && singleToothUri && (
                <View className="items-center bg-blackBlue/75 mb-2 px-3 py-1 rounded-lg">
                  <Text
                    className={`font-bold text-whiteBlue ${!selectedFace ? `italic` : ``}`}
                  >
                    {selectedFace
                      ? translateFace(selectedFace)
                      : "Seleccione una cara del diente"}
                  </Text>
                  {selectedFace && getFaceValues(selectedFace) !== "" && (
                    <Text className="opacity-80 mt-1 text-whiteBlue text-sm">
                      {getFaceValues(selectedFace)}
                    </Text>
                  )}
                </View>
              )}

              {/* Markup Legend */}
              {selectedTooth && singleToothUri && (
                <View className="gap-2 mb-2 w-full">
                  <Text className="font-bold text-blackBlue text-lg">
                    Marcar Cara/Pieza dental
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleStatusChange("green")}
                      disabled={!isEditable || selectedFace === null}
                      className={`${
                        !isEditable || selectedFace === null ? "opacity-50" : ""
                      } bg-green-700 flex-1 items-center active:bg-green-600 px-4 py-2 rounded-md`}
                    >
                      <Text className="text-whiteBlue">
                        Prótesis Maladaptada
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleStatusChange("black")}
                      disabled={!isEditable}
                      className={`${
                        !isEditable ? "opacity-50" : ""
                      } bg-gray-700 items-center active:bg-gray-600 flex-1 px-4 py-2 rounded-md`}
                    >
                      <Text className="text-whiteBlue">Diente Ausente</Text>
                    </Pressable>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleStatusChange("red")}
                      disabled={!isEditable || selectedFace === null}
                      className={`${
                        !isEditable || selectedFace === null ? "opacity-50" : ""
                      } bg-red-700 items-center active:bg-red-600 flex-1 px-4 py-2 rounded-md`}
                    >
                      <Text className="text-whiteBlue">Cáries / LC</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleStatusChange("blue")}
                      disabled={!isEditable || selectedFace === null}
                      className={`${
                        !isEditable || selectedFace === null ? "opacity-50" : ""
                      } bg-blue-700 items-center active:bg-blue-600 flex-1 px-4 py-2 rounded-md`}
                    >
                      <Text className="text-whiteBlue">Implante</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleStatusChange("white")}
                    disabled={!isEditable || selectedFace === null}
                    className={`${
                      !isEditable || selectedFace === null ? "opacity-50" : ""
                    } bg-stone-100 items-center active:bg-stone-200 flex-1 border border-stone-300 px-4 py-2 rounded-md`}
                  >
                    <Text className="font-semibold text-black">Sano</Text>
                  </Pressable>
                </View>
              )}

              {/* Register Date */}
              {currentOdontogram.registerDate && (
                <Text className="mt-5 w-full text-blackBlue/75 text-right italic">
                  Creado el{" "}
                  {new Date(currentOdontogram.registerDate).toLocaleDateString(
                    "es-BO",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </Text>
              )}
              {/* Update Date */}
              {currentOdontogram.updateDate && (
                <Text className="w-full text-blackBlue/75 text-right italic">
                  Actualizado el{" "}
                  {new Date(currentOdontogram.updateDate).toLocaleDateString(
                    "es-BO",
                    {
                      day: "2-digit",
                      month: "long",
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
