import {
  HomeIcon,
  PatientIcon,
  ProfileIcon,
  RequestIcon,
  ScheduleIcon,
} from "@/components/Icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#444",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => <ScheduleIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="patients"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ color }) => <PatientIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color }) => <RequestIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Configuración",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
