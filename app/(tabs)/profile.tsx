import LogInModal from "@/components/account/logInModal";
import { UserDoctorIcon } from "@/components/Icons";
import { BannerModeRadio } from "@/components/radioButton";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [config, setConfig] = useState({
    bannerMode: "Day",
  });

  return (
    <>
      <LinearGradient
        colors={["#02457A", "#018ABE", "#02457A"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8, gap: 12 }}
      >
        <View className="flex-1 items-center gap-3 w-full">
          <View className="flex-row justify-between items-center w-full">
            <Text className="font-bold text-white text-3xl">Mi Cuenta</Text>
            <Pressable
              onPress={
                canEdit ? () => setCanEdit(false) : () => setShowModal(true)
              }
              android_ripple={{ color: "#018ABE" }}
              className="bg-blackBlue px-5 py-1 border border-whiteBlue rounded-lg"
            >
              <Text className="font-semibold text-white text-lg">
                {canEdit ? "Guardar" : "Editar"}
              </Text>
            </Pressable>
          </View>

          <View className="justify-center items-center bg-whiteBlue px-5 py-3 border-2 border-blackBlue rounded-full">
            <UserDoctorIcon color="#001B48" size={72} />
          </View>

          <View className="flex-row items-center gap-5 px-2 w-full">
            <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
              Usuario:
            </Text>
            <TextInput
              className={`flex-1 border-2 border-whiteBlue rounded-lg text-center text-lg ${
                canEdit ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
              }`}
              editable={canEdit}
            />
          </View>

          <View className="flex-row items-center gap-5 px-2 w-full">
            <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
              Contraseña:
            </Text>
            <TextInput
              secureTextEntry={true}
              editable={canEdit}
              className={`flex-1 border-2 border-whiteBlue rounded-lg text-center text-lg ${
                canEdit ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
              }`}
            />
          </View>

          {canEdit && (
            <View className="flex-row items-center gap-5 px-2 w-full">
              <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
                Confirmar Contraseña:
              </Text>
              <TextInput
                secureTextEntry={true}
                editable={canEdit}
                className={`flex-1 border-2 border-whiteBlue rounded-lg text-center text-lg ${
                  canEdit ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
                }`}
              />
            </View>
          )}

          <View className="flex-row items-center gap-5 px-2 w-full">
            <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
              Celular:
            </Text>
            <TextInput
              keyboardType="numeric"
              editable={canEdit}
              className={`flex-1 border-2 border-whiteBlue rounded-lg text-center text-lg ${
                canEdit ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
              }`}
            />
          </View>

          <View className="flex-row items-center gap-5 px-2 w-full">
            <Text className="w-1/2 font-semibold text-whiteBlue text-lg">
              Mostrar Resumen de Citas Programadas para:
            </Text>
            <BannerModeRadio
              editable={canEdit}
              value={config.bannerMode as "Day" | "Week"}
              onChange={(val) => setConfig({ ...config, bannerMode: val })}
            />
          </View>

          <View className="gap-2 px-2 w-full">
            <Text className="font-semibold text-whiteBlue text-lg">
              Plantilla de Mensaje por Whatsapp:
            </Text>
            <TextInput
              editable={canEdit}
              multiline
              numberOfLines={4}
              placeholder="Ej. Hola Buenos días, le mando este mensaje para avisarle que..."
              style={{ textAlignVertical: "top" }}
              className={`h-24 border-2 border-whiteBlue rounded-lg text-lg ${
                canEdit ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
              }`}
            />
          </View>

          <View className="flex-row gap-2 px-2 w-full">
            <Text className="font-semibold text-whiteBlue text-lg">
              Cerrar Sesión cada:
            </Text>
            <Text className="flex-1 text-whiteBlue italic">
              combobox con opciones: cada que salga de la app, 1 hora, 4 horas,
              8 horas
            </Text>
          </View>

          <View className="flex-row items-center gap-2 px-2 w-full">
            <Text className="font-semibold text-whiteBlue text-lg">
              Uso del{`\n`}Almacenamiento:
            </Text>
            <View className="flex-1 bg-blackBlue/50 border border-whiteBlue rounded-full h-8">
              <View
                style={{ width: "50%" }}
                className="bg-pureBlue rounded-full h-full"
              />
              <Text className="right-0 absolute mr-2 font-medium text-whiteBlue text-xl">
                50%
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {showModal && (
        <LogInModal
          onClose={() => setShowModal(false)}
          onSubmit={() => setCanEdit(true)}
        />
      )}
    </>
  );
}
