import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface PopupModalProps {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  children?: ReactNode;
  customDesign?: boolean;
}

export default function PopupModal(props: PopupModalProps) {
  const { showModal, setShowModal, children, customDesign = false } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(!showModal);
      }}
    >
      {customDesign ? (
        <>{children}</>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-blackBlue/50"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="justify-center bg-darkBlue p-5 rounded-lg gap-2">
              {children}
              <Pressable
                onPress={() => setShowModal(false)}
                className="justify-center items-center active:bg-blackBlue px-4 py-1 border border-whiteBlue rounded-full"
              >
                <Text className="text-whiteBlue">Cerrar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}
