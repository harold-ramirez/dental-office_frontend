import RequestCard from "@/components/appointments-requests/requestCard";
import { SadIcon, TriangleDownIcon, TriangleUpIcon } from "@/components/Icons";
import { AppointmentRequestDto } from "@/interfaces/interfaces";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
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
import { useToast } from "react-native-toast-notifications";

export default function Requests() {
  const params = useLocalSearchParams();
  const { logOut } = useContext(AuthContext);
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [requests, setRequests] = useState<AppointmentRequestDto[]>([]);
  const [pastRequests, setPastRequests] = useState<AppointmentRequestDto[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [displayPastRequest, setDisplayPastRequest] = useState(false);
  const [pageSize] = useState(10);
  const [requestPage, setRequestPage] = useState(1);
  const [isLoadingMoreRequests, setIsLoadingMoreRequests] = useState(false);
  const [hasMoreRequests, setHasMoreRequests] = useState(true);
  const [pastRequestPage, setPastRequestPage] = useState(1);
  const [isLoadingMorePastRequests, setIsLoadingMorePastRequests] =
    useState(false);
  const [hasMorePastRequests, setHasMorePastRequests] = useState(true);

  const fetchAllRequests = useCallback(async () => {
    try {
      const endpoint = await fetchWithToken(
        `/appointment-requests?page=1&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );
      setRequests(endpoint);
      setRequestPage(1);
      setHasMoreRequests(endpoint.length === pageSize);
    } catch {
      toast.show("Error al cargar las solicitudes", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    }
  }, [logOut, pageSize, toast]);

  const fetchMoreRequests = useCallback(async () => {
    if (isLoadingMoreRequests || !hasMoreRequests) return;

    try {
      setIsLoadingMoreRequests(true);
      const nextPage = requestPage + 1;
      const endpoint = await fetchWithToken(
        `/appointment-requests?page=${nextPage}&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );

      if (endpoint.length > 0) {
        setRequests((prev) => [...prev, ...endpoint]);
        setRequestPage(nextPage);
        setHasMoreRequests(endpoint.length === pageSize);
      } else {
        setHasMoreRequests(false);
      }
    } catch {
    } finally {
      setIsLoadingMoreRequests(false);
    }
  }, [requestPage, pageSize, isLoadingMoreRequests, hasMoreRequests, logOut]);

  const fetchAllPastRequests = useCallback(async () => {
    try {
      const endpoint = await fetchWithToken(
        `/appointment-requests/pastRequests?page=1&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );
      setPastRequests(endpoint);
      setPastRequestPage(1);
      setHasMorePastRequests(endpoint.length === pageSize);
    } catch {}
  }, [logOut, pageSize]);

  const fetchMorePastRequests = useCallback(async () => {
    if (isLoadingMorePastRequests || !hasMorePastRequests) return;

    try {
      setIsLoadingMorePastRequests(true);
      const nextPage = pastRequestPage + 1;
      const endpoint = await fetchWithToken(
        `/appointment-requests/pastRequests?page=${nextPage}&pageSize=${pageSize}`,
        { method: "GET" },
        logOut,
      );

      if (endpoint.length > 0) {
        setPastRequests((prev) => [...prev, ...endpoint]);
        setPastRequestPage(nextPage);
        setHasMorePastRequests(endpoint.length === pageSize);
      } else {
        setHasMorePastRequests(false);
      }
    } catch {
    } finally {
      setIsLoadingMorePastRequests(false);
    }
  }, [
    pastRequestPage,
    pageSize,
    isLoadingMorePastRequests,
    hasMorePastRequests,
    logOut,
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRequestPage(1);
    setHasMoreRequests(true);
    setPastRequestPage(1);
    setHasMorePastRequests(true);
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

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await fetchWithToken(
          "/users/wa-message",
          { method: "GET" },
          logOut,
        );
        setWhatsappMessage(data.defaultMessage);
      } catch {}
    };
    fetchMessage();
  }, [logOut]);

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
                defaultMessage={whatsappMessage}
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
            onEndReached={() => fetchMoreRequests()}
            onEndReachedThreshold={0.5}
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
                {isLoadingMoreRequests ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator color="#fff" size={30} />
                  </View>
                ) : null}
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
                          defaultMessage={whatsappMessage}
                          request={item}
                          openId={openId}
                          setOpenId={setOpenId}
                        />
                      )}
                      scrollEnabled={false}
                      contentContainerStyle={{ gap: 12 }}
                      onEndReached={() => fetchMorePastRequests()}
                      onEndReachedThreshold={0.5}
                      ListFooterComponent={
                        isLoadingMorePastRequests ? (
                          <View className="py-4 items-center">
                            <ActivityIndicator color="#fff" size={30} />
                          </View>
                        ) : null
                      }
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
