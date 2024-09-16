import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="fire-detection"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => <Ionicons size={28} name="camera-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pose-detection"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => <Ionicons size={28} name="camera-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
