import RequestCard from "@/components/appointments-requests/requestCard";
import { SadIcon, TriangleDownIcon, TriangleUpIcon } from "@/components/Icons";
import { AppointmentRequestDto } from "@/interfaces/interfaces";
import { authService } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const token = await authService.getToken();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Requests() {
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<AppointmentRequestDto[]>([]);
  const [pastRequests, setPastRequests] = useState<AppointmentRequestDto[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [displayPastRequest, setDisplayPastRequest] = useState(false);

  const fetchAllRequests = useCallback(async () => {
    try {
      const endpoint = await fetch(`${API_URL}/appointment-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await endpoint.json();
      setRequests(data);
    } catch (e) {
      console.error("Error fetching requests:", e);
    }
  }, []);

  const fetchAllPastRequests = useCallback(async () => {
    try {
      const endpoint = await fetch(
        `${API_URL}/appointment-requests/pastRequests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await endpoint.json();
      setPastRequests(data);
    } catch (e) {
      console.error("Error fetching requests:", e);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllRequests();
    await fetchAllPastRequests();
    setRefreshing(false);
  }, [fetchAllRequests, fetchAllPastRequests]);

  useEffect(() => {
    onRefresh();
  }, [params.refresh, onRefresh]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "newAppointmentRequest",
      () => {
        onRefresh();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [onRefresh]);

  return (
    <>
      <LinearGradient
        colors={["#02457A", "#018ABE", "#02457A"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8, gap: 12 }}
      >
        <Text className="font-bold text-white text-3xl text-center">
          Solicitudes de Citas Médicas
        </Text>

        {refreshing ? (
          <ActivityIndicator
            className="flex-1 justify-center items-center"
            color={"#fff"}
            size={50}
          />
        ) : (
          <FlatList
            className="flex-1 w-full"
            data={requests}
            keyExtractor={(request) => request.Id.toString()}
            renderItem={({ item }) => (
              <RequestCard
                request={item}
                isRequestActive
                openId={openId}
                setOpenId={setOpenId}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ gap: 12, flexGrow: 1 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <SadIcon color="#9ca3af" size={100} />
                <Text className="font-bold text-gray-400 text-xl italic">
                  No hay Solicitudes
                </Text>
              </View>
            }
            ListFooterComponent={
              <>
                <Pressable
                  onPress={() => setDisplayPastRequest(!displayPastRequest)}
                  android_ripple={{ color: "#02457A" }}
                  className="flex-row items-center gap-2 bg-blackBlue mt-5 px-2 py-1 rounded-md"
                >
                  {displayPastRequest ? (
                    <TriangleUpIcon color="#D6E8EE" size={24} />
                  ) : (
                    <TriangleDownIcon color="#D6E8EE" size={24} />
                  )}
                  <Text className="font-bold text-whiteBlue">
                    Solicitudes Pasadas
                  </Text>
                </Pressable>

                {displayPastRequest &&
                  (refreshing ? (
                    <ActivityIndicator
                      className="flex-1 justify-center items-center"
                      color={"#fff"}
                      size={50}
                    />
                  ) : (
                    <FlatList
                      className="mb-5"
                      data={pastRequests}
                      keyExtractor={(request) => request.Id.toString()}
                      renderItem={({ item }) => (
                        <RequestCard
                          request={item}
                          openId={openId}
                          setOpenId={setOpenId}
                        />
                      )}
                      scrollEnabled={false}
                      contentContainerStyle={{ gap: 12 }}
                      ListEmptyComponent={
                        <View className="flex-1 justify-center items-center">
                          <SadIcon color="#9ca3af" size={100} />
                          <Text className="font-bold text-gray-400 text-xl italic">
                            No hay Solicitudes
                          </Text>
                        </View>
                      }
                    />
                  ))}
              </>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}
