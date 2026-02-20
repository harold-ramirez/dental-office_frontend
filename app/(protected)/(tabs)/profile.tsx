import LogInModal from "@/components/account/logInModal";
import DropdownComponent from "@/components/dropdown";
import { LogoutIcon, UserDoctorIcon } from "@/components/Icons";
import PasswordInput from "@/components/passwordInput";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { validatePassword } from "@/utils/validatePassword";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

export default function Profile() {
  const authContext = useContext(AuthContext);
  const toast = useToast();
  const { logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [userData, setUserData] = useState<{
    username: string;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    gender: string;
    phoneNumber: string;
    defaultMessage: string;
    sessionDurationMinutes: number;
    updateDate: string;
  }>({
    username: "",
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "",
    phoneNumber: "",
    defaultMessage: "",
    sessionDurationMinutes: 30,
    updateDate: "",
  });
  const [originalUserData, setOriginalUserData] = useState<{
    username: string;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    gender: string;
    phoneNumber: string;
    defaultMessage: string;
    sessionDurationMinutes: number;
    updateDate: string;
  }>({
    username: "",
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    gender: "",
    phoneNumber: "",
    defaultMessage: "",
    sessionDurationMinutes: 30,
    updateDate: "",
  });
  const [newPassword, setNewPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateUserData = async () => {
    if (userData.username === "") {
      toast.show("El nombre de usuario no puede ser vacío", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    if (userData.phoneNumber === "") {
      toast.show("Es necesario proporcionar un número de Whatsapp", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    const newData: any = {};
    if (userData.username !== originalUserData.username)
      newData.username = userData.username;

    if (userData.phoneNumber !== originalUserData.phoneNumber)
      newData.phoneNumber = userData.phoneNumber;

    if (userData.defaultMessage !== originalUserData.defaultMessage)
      newData.defaultMessage = userData.defaultMessage;

    if (
      userData.sessionDurationMinutes !==
      originalUserData.sessionDurationMinutes
    )
      newData.sessionDurationMinutes = userData.sessionDurationMinutes;
    if (Object.keys(newData).length === 0) {
      toast.show("No hay cambios para guardar", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      await fetchWithToken(
        "/users",
        {
          method: "PATCH",
          body: JSON.stringify(newData),
        },
        logOut,
      );
      toast.show("Los datos se actualizaron correctamente", {
        type: "success",
        placement: "top",
        duration: 3000,
      });
      setOriginalUserData(userData);
      setEditMode(false);
    } catch {
      toast.show("Error al actualizar los datos", {
        type: "danger",
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      newPassword.oldPassword === "" ||
      newPassword.newPassword === "" ||
      newPassword.confirmPassword === ""
    ) {
      toast.show("Ingrese los campos requeridos", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    if (newPassword.newPassword !== newPassword.confirmPassword) {
      toast.show("Las contraseñas nuevas no coinciden", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    if (newPassword.newPassword === newPassword.oldPassword) {
      toast.show("La nueva contraseña no puede ser igual a la anterior", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }
    const validation = validatePassword(newPassword.newPassword);
    if (!validation.isValid) {
      toast.show(
        "La contraseña debe cumplir con:\n" + validation.errors.join("\n• "),
        {
          type: "danger",
          placement: "top",
          duration: 3000,
        },
      );
      return;
    }

    try {
      setLoading(true);
      await fetchWithToken(
        "/users/change-password",
        {
          method: "PATCH",
          body: JSON.stringify({
            oldPassword: newPassword.oldPassword,
            newPassword: newPassword.newPassword,
          }),
        },
        logOut,
      );
      toast.show(
        "Contraseña cambiada con éxito. Por favor vuelva a iniciar sesión",
        {
          type: "success",
          placement: "top",
          duration: 3000,
        },
      );
      setChangePasswordMode(false);
      setNewPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
      authContext.logOut();
    } catch (e: any) {
      const errorMessage = e.message || "Error desconocido";
      if (errorMessage.includes("403")) {
        toast.show("Contraseña actual incorrecta", {
          type: "danger",
          placement: "top",
        });
      } else {
        toast.show("Error al cambiar la contraseña. Intente nuevamente", {
          type: "danger",
          placement: "top",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const fetchUserData = async () => {
        const data = await fetchWithToken("/users", { method: "GET" }, logOut);
        setUserData(data);
        setOriginalUserData(data);
      };
      fetchUserData();
    } catch {}
  }, [logOut]);

  return (
    <>
      <LinearGradient
        colors={["#02457A", "#018ABE", "#02457A"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 justify-center"
      >
        <ScrollView
          className="w-full"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <SafeAreaView
            edges={["top", "left", "right"]}
            style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8, gap: 12 }}
          >
            <View className="flex-1 items-center gap-3 w-full">
              <View className="flex-row justify-between items-center w-full">
                <Text className="font-bold text-white text-3xl">Mi Cuenta</Text>
                {/* Edit Info Buttons */}
                {!changePasswordMode && (
                  <View className="flex-row">
                    {/* Cancel */}
                    {editMode && (
                      <Pressable
                        onPress={() => {
                          setEditMode(false);
                          setUserData(originalUserData);
                        }}
                        className={`items-center px-4 py-1 border border-whiteBlue active:bg-pureBlue rounded-l-lg`}
                      >
                        <Text className="font-semibold text-whiteBlue text-lg">
                          Cancelar
                        </Text>
                      </Pressable>
                    )}
                    {/* Confirm */}
                    <Pressable
                      onPress={
                        editMode
                          ? () => handleUpdateUserData()
                          : () => setShowModal(true)
                      }
                      disabled={loading}
                      className={`bg-blackBlue px-5 py-1 border active:bg-pureBlue border-whiteBlue ${editMode ? `rounded-r-lg` : `rounded-lg`}`}
                    >
                      <Text className="font-semibold text-white text-lg">
                        {editMode
                          ? loading
                            ? "Cargando..."
                            : "Guardar"
                          : "Editar"}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <View className="justify-center items-center bg-whiteBlue px-5 py-3 border-2 border-blackBlue rounded-full">
                <UserDoctorIcon color="#001B48" size={72} />
              </View>

              {/* Username */}
              <View className="flex-row items-center gap-5 px-2 w-full">
                <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
                  Usuario:
                </Text>
                <TextInput
                  className={`flex-1 border-2 border-whiteBlue rounded-lg text-center text-lg ${
                    editMode ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
                  }`}
                  editable={editMode}
                  value={userData.username}
                  onChangeText={(val) =>
                    setUserData({ ...userData, username: val })
                  }
                />
              </View>

              {/* Whatsapp Number */}
              <View className="flex-row items-center gap-5 px-2 w-full">
                <Text className="w-1/2 font-semibold text-whiteBlue text-lg">
                  Número de Whatsapp:
                  <Text className="text-sm italic">
                    (para mostrar en página web)
                  </Text>
                </Text>
                <View
                  className={`flex-row flex-1 items-center border-2 ${editMode ? `bg-whiteBlue` : ``}  border-whiteBlue rounded-lg`}
                >
                  <Text
                    className={`pl-2 text-lg ${
                      editMode ? `text-blackBlue` : `text-whiteBlue`
                    }`}
                  >
                    +591
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    editable={editMode}
                    className={`text-center flex-1 text-lg ${
                      editMode
                        ? `bg-whiteBlue text-blackBlue`
                        : `text-whiteBlue`
                    }`}
                    value={userData.phoneNumber}
                    onChangeText={(val) =>
                      setUserData({ ...userData, phoneNumber: val })
                    }
                  />
                </View>
              </View>

              {/* Whatsapp Message */}
              <View className="gap-2 px-2 w-full">
                <Text className="font-semibold text-whiteBlue text-lg">
                  Plantilla de Mensaje por Whatsapp:
                </Text>
                <TextInput
                  editable={editMode}
                  multiline
                  numberOfLines={4}
                  placeholder={
                    editMode
                      ? "Ej. Hola Buenos días, le mando este mensaje para avisarle que..."
                      : ""
                  }
                  placeholderTextColor={"gray"}
                  style={{ textAlignVertical: "top" }}
                  className={`h-24 border-2 border-whiteBlue rounded-lg text-lg ${
                    editMode ? `bg-whiteBlue text-blackBlue` : `text-whiteBlue`
                  }`}
                  value={userData.defaultMessage}
                  onChangeText={(val) =>
                    setUserData({ ...userData, defaultMessage: val })
                  }
                />
              </View>

              {/* Login duration */}
              <View className="flex-row gap-2 px-2 w-full">
                <Text className="font-semibold text-whiteBlue text-lg">
                  Cerrar Sesión cada:
                </Text>
                <DropdownComponent
                  search={false}
                  disabled={!editMode}
                  className="flex-1 h-8"
                  data={[
                    { label: "1/2 hora", value: "30" },
                    { label: "1 hora", value: "60" },
                    { label: "2 horas", value: "120" },
                    { label: "3 horas", value: "180" },
                    { label: "4 horas", value: "240" },
                    { label: "8 horas", value: "480" },
                  ]}
                  value={userData.sessionDurationMinutes.toString()}
                  setValue={(val) => {
                    setUserData({ ...userData, sessionDurationMinutes: +val });
                  }}
                />
              </View>

              {/* Password inputs */}
              {changePasswordMode && (
                <>
                  <View className="flex-row items-center gap-5 px-2 w-full">
                    <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
                      Contraseña Actual:
                    </Text>
                    <PasswordInput
                      value={newPassword.oldPassword}
                      placeholder="Ingrese su contraseña actual"
                      disabled={loading || !changePasswordMode}
                      className="flex-row flex-1 items-center gap-1 bg-whiteBlue rounded-lg h-12"
                      setValue={(val) =>
                        setNewPassword({ ...newPassword, oldPassword: val })
                      }
                    />
                  </View>
                  <View className="flex-row items-center gap-5 px-2 w-full">
                    <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
                      Nueva Contraseña:
                    </Text>
                    <PasswordInput
                      value={newPassword.newPassword}
                      placeholder="Ingrese su nueva contraseña"
                      disabled={loading || !changePasswordMode}
                      className="flex-row flex-1 items-center gap-1 bg-whiteBlue rounded-lg h-12"
                      setValue={(val) =>
                        setNewPassword({ ...newPassword, newPassword: val })
                      }
                    />
                  </View>
                  <View className="flex-row items-center gap-5 px-2 w-full">
                    <Text className="w-1/4 font-semibold text-whiteBlue text-lg">
                      Confirmar Contraseña:
                    </Text>
                    <PasswordInput
                      value={newPassword.confirmPassword}
                      placeholder="Repita su nueva contraseña"
                      disabled={loading || !changePasswordMode}
                      className="flex-row flex-1 items-center gap-1 bg-whiteBlue rounded-lg h-12"
                      setValue={(val) =>
                        setNewPassword({ ...newPassword, confirmPassword: val })
                      }
                    />
                  </View>
                  <Text className="self-end w-2/3 text-whiteBlue/75 text-right italic">
                    * 8 caracteres mínimo (mayúsculas, minúsculas, números y
                    símbolos)
                  </Text>
                </>
              )}
              {/* Password Buttons */}
              {!editMode && (
                <View className="flex-row justify-end w-full">
                  {/* Cancel */}
                  {changePasswordMode && (
                    <Pressable
                      onPress={() => {
                        setChangePasswordMode(false);
                        setNewPassword({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className={`items-center mb-5 py-1 border border-whiteBlue active:bg-pureBlue w-1/2 ${changePasswordMode ? `rounded-l-full` : `rounded-full`}`}
                    >
                      <Text className="font-semibold text-whiteBlue text-lg">
                        Cancelar
                      </Text>
                    </Pressable>
                  )}
                  {/* Confirm */}
                  <Pressable
                    onPress={() =>
                      changePasswordMode
                        ? handleChangePassword()
                        : setChangePasswordMode(!changePasswordMode)
                    }
                    disabled={loading}
                    className={`items-center bg-blackBlue mb-5 py-1 border active:bg-pureBlue border-whiteBlue w-1/2 ${changePasswordMode ? `rounded-r-full` : `rounded-full`}`}
                  >
                    <Text className="font-semibold text-whiteBlue text-lg">
                      {changePasswordMode
                        ? loading
                          ? "Cargando..."
                          : "Guardar"
                        : "Cambiar contraseña"}
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Log out Button */}
              {!editMode && !changePasswordMode && (
                <Pressable
                  onPress={authContext.logOut}
                  className="flex-row justify-center items-center gap-2 bg-blackBlue mt-5 p-2 border border-whiteBlue rounded-full w-3/4 overflow-hidden"
                >
                  <LogoutIcon color={"#D6E8EE"} size={24} />
                  <Text className="font-semibold text-whiteBlue text-lg">
                    Cerrar Sesión
                  </Text>
                </Pressable>
              )}

              {/* Update Date */}
              {userData.updateDate && (
                <Text className="mb-5 w-full text-whiteBlue/80 text-right italic">
                  Actualizado el:{" "}
                  {new Date(userData.updateDate).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              )}
            </View>
          </SafeAreaView>
        </ScrollView>
        {showModal && (
          <LogInModal
            onClose={() => setShowModal(false)}
            onSubmit={() => setEditMode(true)}
            logOut={logOut}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
}
