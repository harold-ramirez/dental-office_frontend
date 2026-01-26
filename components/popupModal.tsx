import { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

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
        <View className="flex-1 justify-center items-center bg-blackBlue/50">
          <View className="justify-center bg-darkBlue p-5 rounded-lg">
            {children}
            <Pressable
              onPress={() => setShowModal(false)}
              className="justify-center items-center active:bg-blackBlue mt-5 px-4 py-1 border border-whiteBlue rounded-full"
            >
              <Text className="text-whiteBlue">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}
