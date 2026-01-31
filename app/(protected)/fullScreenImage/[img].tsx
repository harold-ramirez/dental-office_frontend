import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImageViewerScreen() {
  const { img } = useLocalSearchParams();
  const router = useRouter();
  const imageUri = Array.isArray(img) ? img[0] : img;
  const { width, height } = Dimensions.get("window");
  const imgScale = useSharedValue(1);
  const xFocus = useSharedValue(0);
  const yFocus = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      xFocus.value = e.focalX;
      yFocus.value = e.focalY;
    })
    .onUpdate((e) => {
      imgScale.value = e.scale;
    })
    .onEnd(() => {
      if (imgScale.value < 1) imgScale.value = withTiming(1, { duration: 300 });
    });

  const imgCenter = {
    x: width / 2,
    y: height / 2,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xFocus.value },
      { translateY: yFocus.value },
      { translateX: -imgCenter.x },
      { translateY: -imgCenter.y },
      { scale: imgScale.value },
      { translateX: -xFocus.value },
      { translateY: -yFocus.value },
      { translateX: imgCenter.x },
      { translateY: imgCenter.y },
    ],
  }));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaView
      edges={["bottom", "top"]}
      className="bg-stone-900 flex-1 items-center justify-center"
    >
      <Stack.Screen options={{ headerShown: false, orientation: "default" }} />
      <GestureHandlerRootView className="w-full h-full">
        <GestureDetector gesture={pinch}>
          <Animated.Image
            style={[animatedStyle, { width, height }]}
            source={{ uri: imageUri }}
            resizeMode="contain"
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
