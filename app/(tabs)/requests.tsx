import RequestCard from "@/components/appointment-requests/requestCard";
import { SadIcon } from "@/components/Icons";
import { AppointmentRequestDto } from "@/interfaces/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Requests() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<AppointmentRequestDto[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  const fetchAllRequests = useCallback(async () => {
    try {
      const endpoint = await fetch(`${apiUrl}/appointment-requests`);
      const data = await endpoint.json();
      setRequests(data);
    } catch (e) {
      console.error("Error fetching requests:", e);
    }
  }, [apiUrl]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllRequests();
    setRefreshing(false);
  }, [fetchAllRequests]);

  useEffect(() => {
    onRefresh();
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
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 4, gap: 12 }}
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
          />
        )}
      </SafeAreaView>
    </>
  );
}
