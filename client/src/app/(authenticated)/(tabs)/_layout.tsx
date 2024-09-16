import { Tabs } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';

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
        name="CPR"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="heart-pulse" color={"red"} />,
        }}
      />
    </Tabs>
  );
}
