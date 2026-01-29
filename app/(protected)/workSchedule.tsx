import { WorkScheduleSelection } from "@/components/appointments-requests/scheduleModes";
import { authService } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const token = await authService.getToken();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function WorkSchedule() {
  const [message, setMessage] = useState<{ isError: boolean; text: string }>({
    isError: false,
    text: "",
  });
  const [shifts, setShifts] = useState<{
    Monday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Tuesday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Wednesday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Thursday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Friday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Saturday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Sunday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
  }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [originalShifts, setOriginalShifts] = useState<{
    Monday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Tuesday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Wednesday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Thursday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Friday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Saturday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
    Sunday: {
      Id: number;
      hour: string;
      status: boolean;
    }[];
  }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await fetch(`${API_URL}/shifts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        setShifts(data);
        setOriginalShifts(data);
      } catch (e) {
        console.error("Error fetching shifts:", e);
      }
    };
    fetchShifts();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setMessage({
        isError: false,
        text: "",
      });
      const updatedShifts: {
        Id: number;
        status: boolean;
      }[] = [];
      // ***************************************************
      for (let i = 0; i < originalShifts.Monday.length; i++) {
        if (shifts.Monday[i].status !== originalShifts.Monday[i].status) {
          updatedShifts.push({
            Id: shifts.Monday[i].Id,

            status: shifts.Monday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Tuesday.length; i++) {
        if (shifts.Tuesday[i].status !== originalShifts.Tuesday[i].status) {
          updatedShifts.push({
            Id: shifts.Tuesday[i].Id,

            status: shifts.Tuesday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Wednesday.length; i++) {
        if (shifts.Wednesday[i].status !== originalShifts.Wednesday[i].status) {
          updatedShifts.push({
            Id: shifts.Wednesday[i].Id,
            status: shifts.Wednesday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Thursday.length; i++) {
        if (shifts.Thursday[i].status !== originalShifts.Thursday[i].status) {
          updatedShifts.push({
            Id: shifts.Thursday[i].Id,

            status: shifts.Thursday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Friday.length; i++) {
        if (shifts.Friday[i].status !== originalShifts.Friday[i].status) {
          updatedShifts.push({
            Id: shifts.Friday[i].Id,

            status: shifts.Friday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Saturday.length; i++) {
        if (shifts.Saturday[i].status !== originalShifts.Saturday[i].status) {
          updatedShifts.push({
            Id: shifts.Saturday[i].Id,

            status: shifts.Saturday[i].status,
          });
        }
      }
      for (let i = 0; i < originalShifts.Sunday.length; i++) {
        if (shifts.Sunday[i].status !== originalShifts.Sunday[i].status) {
          updatedShifts.push({
            Id: shifts.Sunday[i].Id,

            status: shifts.Sunday[i].status,
          });
        }
      }
      if (updatedShifts.length === 0) {
        setMessage({
          isError: true,
          text: "No se hayaron cambios para aplicar en el horario de atención",
        });
        return;
      }
      setOriginalShifts(shifts);
      // ***************************************************
      const res = await fetch(`${API_URL}/shifts`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedShifts),
      });
      if (res.ok) {
        setMessage({
          isError: false,
          text: "Se aplicaron los cambios exitosamente",
        });
      } else {
        setMessage({
          isError: true,
          text: "Se produjo un error al actualizar el horario",
        });
      }
    } catch (error) {
      console.log("Error updating shifts", error);
    }
  };

  return (
    <>
      <LinearGradient
        colors={["#97CADB", "#02457A", "#018ABE"]}
        className="top-0 right-0 bottom-0 left-0 absolute"
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingTop: 12,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#001B48" },
            headerTintColor: "#D6E8EE",
            headerTitle: "HORARIO DE ATENCIÓN",
            headerTitleStyle: {
              fontSize: 18,
            },
            headerRight: () => <></>,
          }}
        />
        <View className="flex-1 items-center bg-whiteBlue rounded-xl w-full">
          <View className="flex-row justify-end gap-5 my-2 px-2 w-full">
            <View className="flex-row items-center gap-1">
              <View className="bg-darkBlue size-5" />
              <Text className="italic">Abierto</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="bg-lightBlue size-5" />
              <Text className="italic">Cerrado</Text>
            </View>
          </View>
          <View className="flex-1">
            <WorkScheduleSelection shifts={shifts} setShifts={setShifts} />
          </View>

          <Text
            className={`font-semibold text-center ${
              message.text === "" ? "hidden" : "block"
            } ${message.isError ? "text-red-500" : "text-blackBlue"}`}
          >
            {message.text}
          </Text>

          <Pressable
            onPress={() => handleSaveChanges()}
            className="items-center bg-blackBlue active:bg-darkBlue my-2 py-2 rounded-full w-3/4"
          >
            <Text className="font-semibold text-whiteBlue text-lg">
              Guardar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
