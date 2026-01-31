import AnimatedArc from "@/components/animatedArc";
import {
  CigarIcon,
  ClockIcon,
  ScheduleIcon,
  SickIcon,
  ToothIcon,
} from "@/components/Icons";
import PopupModal from "@/components/popupModal";
import { Summary, WeekSummary } from "@/components/summaries";
import { fetchWithToken } from "@/services/fetchData";
import { AuthContext } from "@/utils/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const BANNER_HEIGHT = 150;
  const { logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pathologiesModal, setPatologiesModal] = useState(false);
  const [treatmentsModal, setTreatmentsModal] = useState(false);
  const [habitsModal, setHabitsModal] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<
    {
      patientName: string;
      treatment: string;
      pendingAmount: number;
    }[]
  >([]);
  const [newMiscData, setNewMiscData] = useState({
    treatment: "",
    habit: "",
    pathology: "",
  });
  const [miscData, setMiscData] = useState<{
    treatments: string[];
    pathologies: string[];
    habits: string[];
  }>({
    treatments: [],
    pathologies: [],
    habits: [],
  });
  const [summary, setSummary] = useState<{
    today: number;
    tomorrow: number;
    currentWeek: number;
    currentWeekByDay: number[];
    pendingRequests: number;
  }>({
    today: 0,
    tomorrow: 0,
    currentWeek: 0,
    currentWeekByDay: [],
    pendingRequests: 0,
  });

  const splitNameIntoLines = (name: string): string => {
    const words = name.trim().split(" ");
    if (words.length <= 1) return name;

    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(" ");
    const secondLine = words.slice(mid).join(" ");

    return `${firstLine}\n${secondLine}`;
  };

  const handlePostNewMiscData = async (
    url: string,
    newObject: { name: string },
  ) => {
    if (!newObject.name.trim()) return;
    setLoading(true);
    try {
      const data = await fetchWithToken(
        url,
        { method: "POST", body: JSON.stringify(newObject) },
        logOut,
      );
      switch (url) {
        case "/treatments":
          setMiscData((prev) => ({
            ...prev,
            treatments: [...prev.treatments, data.name],
          }));
          setNewMiscData((prev) => ({ ...prev, treatment: "" }));
          break;
        case "/habits":
          setMiscData((prev) => ({
            ...prev,
            habits: [...prev.habits, data.name],
          }));
          setNewMiscData((prev) => ({ ...prev, habit: "" }));
          break;
        case "/personal-pathologies":
          setMiscData((prev) => ({
            ...prev,
            pathologies: [...prev.pathologies, data.name],
          }));
          setNewMiscData((prev) => ({ ...prev, pathology: "" }));
          break;
      }
    } catch (e) {
      console.log("Error creating", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsSummary = useCallback(async () => {
    const data = await fetchWithToken(
      "/appointments/summary",
      { method: "GET" },
      logOut,
    );
    setSummary(data);
  }, [logOut]);

  const fetchMiscData = useCallback(async () => {
    const [treatmentsData, habitsData, pathologiesData] = await Promise.all([
      fetchWithToken("/treatments", { method: "GET" }, logOut),
      fetchWithToken("/habits", { method: "GET" }, logOut),
      fetchWithToken("/personal-pathologies", { method: "GET" }, logOut),
    ]);
    setMiscData({
      treatments: treatmentsData.map(
        (t: { Id: number; name: string }) => t.name,
      ),
      habits: habitsData.map((h: { Id: number; name: string }) => h.name),
      pathologies: pathologiesData.map(
        (p: { Id: number; name: string }) => p.name,
      ),
    });
  }, [logOut]);

  const fetchPendingPayments = useCallback(async () => {
    const data = await fetchWithToken(
      "/diagnosed-procedure/pending-payments",
      { method: "GET" },
      logOut,
    );
    setPendingPayments(data);
  }, [logOut]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchAppointmentsSummary(),
        fetchMiscData(),
        fetchPendingPayments(),
      ]);
    } catch (e) {
      console.log("Error refreshing:", e);
    } finally {
      setRefreshing(false);
    }
  }, [fetchAppointmentsSummary, fetchMiscData, fetchPendingPayments]);

  useEffect(() => {
    fetchAppointmentsSummary().catch((e) =>
      console.error("Error getting appointments summary:", e),
    );
  }, [fetchAppointmentsSummary]);

  useEffect(() => {
    fetchMiscData().catch((e) => console.log("Error getting misc data:", e));
    fetchPendingPayments().catch((e) =>
      console.log("Error getting pending payments:", e),
    );
  }, [fetchMiscData, fetchPendingPayments]);

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <LinearGradient
        colors={["#018ABE", "#001B48"]}
        className="top-0 right-0 left-0 absolute h-full"
      />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}
      >
        <Text className="my-2 font-bold text-white text-3xl">
          Mi Consultorio Dental
        </Text>
        {/* Banner */}
        <View style={{ height: BANNER_HEIGHT, zIndex: 0 }}>
          <AnimatedArc
            number={summary.today}
            text={`Cita${summary.today !== 1 ? `s` : ``} Programada${
              summary.today !== 1 ? `s` : ``
            } ${`\n`} para el día de hoy`}
            duration={1000}
            delay={250}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 0 }}
          style={{ marginTop: -BANNER_HEIGHT }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ height: BANNER_HEIGHT }} />
          {/* Content */}
          <View className="flex-1 items-center gap-3 bg-whiteBlue p-3 rounded-t-2xl w-full">
            <WeekSummary weekSummary={summary.currentWeekByDay} />
            <Summary
              tomorrow={summary.tomorrow}
              currentWeek={summary.currentWeek}
              pendingRequests={summary.pendingRequests}
            />
            {/* Buttons */}
            <View className="flex-row gap-3">
              {/* Configure Shifts */}
              <Link href={"/workSchedule"} asChild>
                <Pressable className="flex-1 justify-around items-center bg-pureBlue active:bg-darkBlue px-3 py-2 rounded-lg">
                  <ClockIcon color="#D6E8EE" size={40} />
                  <Text className="font-semibold text-whiteBlue text-center">
                    Configurar Horario
                  </Text>
                </Pressable>
              </Link>
              {/* Schedule Appointment */}
              <Link
                href={{
                  pathname: "/(protected)/createAppointment/[selectedDate]",
                  params: { selectedDate: new Date().toISOString() },
                }}
                asChild
              >
                <Pressable className="flex-1 justify-around items-center bg-pureBlue active:bg-darkBlue px-3 py-2 rounded-lg">
                  <ScheduleIcon color="#D6E8EE" size={48} />
                  <Text className="font-semibold text-whiteBlue text-center">
                    Agendar Cita
                  </Text>
                </Pressable>
              </Link>
            </View>
            <View className="flex-row gap-3">
              {/* Manage Treatments */}
              <Pressable
                onPress={() => setTreatmentsModal(true)}
                className="flex-1 justify-center items-center bg-pureBlue active:bg-darkBlue px-3 py-2 rounded-lg"
              >
                <ToothIcon color="#D6E8EE" size={35} />
                <Text className="font-semibold text-whiteBlue text-center">
                  Tratamientos
                </Text>
              </Pressable>
              {/* Manage Habits */}
              <Pressable
                onPress={() => setHabitsModal(true)}
                className="flex-1 justify-center items-center bg-pureBlue active:bg-darkBlue px-3 py-2 rounded-lg"
              >
                <CigarIcon color="#D6E8EE" size={35} />
                <Text className="font-semibold text-whiteBlue text-center">
                  Hábitos de pacientes
                </Text>
              </Pressable>
              {/* Manage Pathologies */}
              <Pressable
                onPress={() => setPatologiesModal(true)}
                className="flex-1 justify-center items-center bg-pureBlue active:bg-darkBlue px-3 py-2 rounded-lg"
              >
                <SickIcon color="#D6E8EE" size={35} />
                <Text className="font-semibold text-whiteBlue text-center">
                  Patologías
                </Text>
              </Pressable>
            </View>
            {/* Pending Payments */}
            <View className="gap-1 w-full">
              <Text className="font-bold text-blackBlue">
                Tratamientos con Saldo Pendiente:
              </Text>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                className="p-2 border border-darkBlue rounded-lg h-48"
              >
                <View
                  className={`mb-5 gap-3 ${pendingPayments.length === 0 ? `items-center justify-center` : ``}`}
                >
                  {pendingPayments.length === 0 ? (
                    <Text className="text-blackBlue/75 italic">
                      Todos los pagos están al día
                    </Text>
                  ) : (
                    pendingPayments.map((pending, i) => (
                      <View key={i} className="flex-row items-end gap-1">
                        <Text className="text-blackBlue">
                          {i + 1 + ") "}
                          {splitNameIntoLines(pending.patientName)}
                        </Text>
                        <View className="flex-1 border-blackBlue border-t border-dashed" />
                        <Text className="text-blackBlue text-right">
                          {"(" + pending.pendingAmount + " Bs.)"}
                          {`\n`}
                          {pending.treatment}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Treatments Modal */}
      <PopupModal showModal={treatmentsModal} setShowModal={setTreatmentsModal}>
        <Text className="font-bold text-whiteBlue text-xl">
          Tratamientos Disponibles
        </Text>
        <View className="mb-5 p-1">
          {miscData.treatments.length === 0 ? (
            <Text className="text-whiteBlue italic">
              No hay tratamientos registrados
            </Text>
          ) : (
            miscData.treatments.map((treatment: string, i) => (
              <Text key={i} className="text-whiteBlue">
                - {treatment}
              </Text>
            ))
          )}
        </View>
        <TextInput
          className="bg-whiteBlue rounded-md text-center"
          placeholder="Nuevo Tratamiento"
          placeholderTextColor={"gray"}
          value={newMiscData.treatment}
          onChangeText={(val) =>
            setNewMiscData({ ...newMiscData, treatment: val })
          }
        />
        <Pressable
          onPress={() =>
            handlePostNewMiscData("/treatments", {
              name: newMiscData.treatment,
            })
          }
          disabled={loading}
          className="items-center bg-blackBlue active:bg-darkBlue p-2 border border-whiteBlue rounded-full"
        >
          <Text className="font-semibold text-whiteBlue">
            {loading ? "Registrando..." : "Registrar"}
          </Text>
        </Pressable>
      </PopupModal>
      {/* Habits Modal */}
      <PopupModal showModal={habitsModal} setShowModal={setHabitsModal}>
        <Text className="font-bold text-whiteBlue text-xl">
          Hábitos de Pacientes Registrados
        </Text>
        <View className="mb-5 p-1">
          {miscData.habits.length === 0 ? (
            <Text className="text-whiteBlue italic">
              No hay hábitos registrados
            </Text>
          ) : (
            miscData.habits.map((habit: string, i) => (
              <Text key={i} className="text-whiteBlue">
                - {habit}
              </Text>
            ))
          )}
        </View>
        <TextInput
          className="bg-whiteBlue rounded-md text-center"
          placeholder="Nuevo Hábito"
          placeholderTextColor={"gray"}
          value={newMiscData.habit}
          onChangeText={(val) => setNewMiscData({ ...newMiscData, habit: val })}
        />
        <Pressable
          onPress={() =>
            handlePostNewMiscData("/habits", { name: newMiscData.habit })
          }
          disabled={loading}
          className="items-center bg-blackBlue active:bg-darkBlue p-2 border border-whiteBlue rounded-full"
        >
          <Text className="font-semibold text-whiteBlue">
            {loading ? "Registrando..." : "Registrar"}
          </Text>
        </Pressable>
      </PopupModal>
      {/* Pathologies Modal */}
      <PopupModal
        showModal={pathologiesModal}
        setShowModal={setPatologiesModal}
      >
        <Text className="font-bold text-whiteBlue text-xl">
          Patologías Registradas
        </Text>
        <View className="mb-5 p-1">
          {miscData.pathologies.length === 0 ? (
            <Text className="text-whiteBlue italic">
              No hay Patologías registradas
            </Text>
          ) : (
            miscData.pathologies.map((pathology: string, i) => (
              <Text key={i} className="text-whiteBlue">
                - {pathology}
              </Text>
            ))
          )}
        </View>
        <TextInput
          className="bg-whiteBlue rounded-md text-center"
          placeholder="Nueva Patología"
          placeholderTextColor={"gray"}
          value={newMiscData.pathology}
          onChangeText={(val) =>
            setNewMiscData({ ...newMiscData, pathology: val })
          }
        />
        <Pressable
          onPress={() =>
            handlePostNewMiscData("/personal-pathologies", {
              name: newMiscData.pathology,
            })
          }
          disabled={loading}
          className="items-center bg-blackBlue active:bg-darkBlue p-2 border border-whiteBlue rounded-full"
        >
          <Text className="font-semibold text-whiteBlue">
            {loading ? "Registrando..." : "Registrar"}
          </Text>
        </Pressable>
      </PopupModal>
    </>
  );
}
