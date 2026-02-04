import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
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
  const [isEditMode, setIsEditMode] = useState(false);

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
            {/* Header */}
            {/* <View className="flex-row justify-between">
            <Pressable
              onPress={() => setIsAdultModel(!isAdultModel)}
              disabled={isEditMode ? false : true}
              android_ripple={{ color: "#018ABE" }}
              className="bg-whiteBlue px-5 py-1 border-2 border-blackBlue rounded-lg"
            >
              <Text className="font-semibold text-blackBlue text-lg">
                Modelo: {isAdultModel ? "Adulto" : "Niño"}
              </Text>
            </Pressable>

            <Pressable
              onPress={
                isEditMode
                  ? () => setIsEditMode(false) //Save
                  : () => setIsEditMode(true)
              }
              android_ripple={{ color: "#018ABE" }}
              className="flex-row justify-center items-center gap-2 bg-darkBlue px-5 py-1 rounded-md"
            >
              <EditIcon color="#D6E8EE" size={20} />
              <Text className="font-semibold text-whiteBlue text-lg">
                {isEditMode ? "Guardar" : "Editar"}
              </Text>
            </Pressable>
          </View> */}

            {/* 3D Odontogram */}
            <Animated.View
              style={[{ height: ODONTOGRAM_HEIGHT }, odontogramAnimationStyle]}
              className="bg-blackBlue/50 border-2 border-green-500 w-full"
            ></Animated.View>

            {/* Content */}
            <View className="items-center bg-whiteBlue px-5 py-3 rounded-t-2xl w-full min-h-24">
              <View className="mb-3 border-2 border-stone-400 rounded-full w-1/5" />
              <Text>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex,
                odio non voluptatibus numquam, quaerat mollitia accusantium
                incidunt provident saepe sunt sint enim deserunt facere dicta
                suscipit, voluptates molestiae delectus debitis eius sapiente?
                Recusandae pariatur laborum aspernatur iusto, tenetur aut
                repudiandae. Doloremque odit dicta tempora. Qui debitis ullam
                iste molestias optio rem soluta corrupti eligendi commodi, non
                omnis obcaecati quibusdam nostrum quas laboriosam. Aperiam sint
                rem dolorum magnam totam ex necessitatibus maxime vero. Aliquid
                doloremque quisquam repellat asperiores odit voluptate provident
                officia adipisci dolore hic amet repellendus quis reprehenderit
                vel, similique autem? Exercitationem, ratione earum consequatur
                placeat officiis, nulla quam ad minima nisi voluptatem culpa nam
                harum quisquam unde quae ea impedit eaque aperiam eius
                voluptatum odit veritatis deserunt doloribus. Necessitatibus
                iusto reprehenderit, odit quod deserunt minima praesentium
                expedita nemo, quis perferendis esse, sit eos sequi. Autem
                quaerat repudiandae officiis laboriosam aliquam soluta facilis
                distinctio mollitia ipsam quo, sed exercitationem consequatur
                velit, reiciendis provident est optio tempore iste impedit
                libero adipisci accusantium minima molestias? Enim voluptatibus
                doloribus perferendis, a quibusdam, harum, mollitia omnis ut
                nemo tempora impedit voluptatem porro fugiat. Sapiente
                reiciendis, quibusdam est iusto maxime odio aut illum rem
                aliquid nostrum aspernatur quas aliquam sint expedita? Omnis
                expedita nulla nesciunt, quaerat ratione aliquam accusantium
                vitae excepturi, laborum, facilis necessitatibus autem? Quae
                perferendis voluptate quia aut odit voluptatibus eligendi sint
                provident recusandae dignissimos. Porro quia amet ratione
                nesciunt enim quae ad cumque aliquam fugit, corporis ea? Eum
                corporis magnam perspiciatis praesentium ratione, et fugit eos
                aliquam exercitationem nisi nulla veniam, voluptatibus minima
                ullam excepturi illum? Libero amet hic eligendi provident ex
                quidem tempore accusamus! Rem, neque! Doloribus et ad hic saepe
                obcaecati consequatur eius quae quas earum perferendis?
                Molestias reprehenderit quo accusamus sapiente unde rem fugit
                sit corporis, maiores vero minus aliquid facere tempora
                perspiciatis reiciendis obcaecati in placeat magni non provident
                magnam numquam dolor? Itaque quibusdam voluptas deleniti nulla
                quo ea dicta deserunt quidem autem placeat cupiditate ipsum
                quasi, eaque ad, provident molestiae cumque! Aliquam nobis
                doloremque necessitatibus nulla. Enim, nam accusantium optio
                voluptatibus nisi, corrupti pariatur deleniti rem quo aperiam
                quod repudiandae sed. Omnis, minima. Eveniet non tempore optio
                voluptate aut ab delectus ipsam dolorum placeat. Ratione error
                minus, laboriosam accusamus porro corrupti placeat est
                assumenda, facilis alias quo quae corporis cupiditate!
                Doloribus, amet. Exercitationem fugiat beatae repellendus quam
                repudiandae perferendis dolor accusantium mollitia corporis
                error adipisci magni nemo quasi expedita optio laboriosam ab
                voluptates obcaecati, quaerat rem! Blanditiis modi nobis quasi
                amet incidunt sit assumenda totam labore magni repellendus
                excepturi perferendis culpa quam beatae ipsa laudantium quos
                fugiat dolorum quo praesentium, est illum possimus voluptatem
                veritatis? Voluptatem, harum quae ipsa necessitatibus iure
                accusantium dolorem blanditiis quas quia fuga libero error est
                sit fugiat explicabo itaque odio eius molestiae reiciendis.
                Impedit, voluptates rerum! Voluptate quas optio aliquam totam.
                Repudiandae cupiditate nisi ipsam vitae perspiciatis repellendus
                aliquid quo odio saepe ab suscipit est nulla dolores corrupti,
                minima molestiae soluta fugit facere inventore autem libero
                atque, amet eos at! Soluta culpa, molestias ipsa aut porro in
                accusamus reiciendis. Excepturi, ea tempora!
              </Text>
            </View>

            {/* Markup Legend */}
            {/* <View className="flex-row gap-5 bg-whiteBlue mb-2 p-2 rounded-lg">
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-green-500 rounded-full size-6" />
                <Text className="text-blackBlue">Prótesis Maladaptada</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="bg-black rounded-full size-6" />
                <Text className="text-blackBlue">Diente Ausente</Text>
              </View>
            </View>
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-red-500 rounded-full size-6" />
                <Text className="text-blackBlue">Cáries / LC</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="bg-blue-500 rounded-full size-6" />
                <Text className="text-blackBlue">Implante</Text>
              </View>
            </View>
            </View> */}
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
}
