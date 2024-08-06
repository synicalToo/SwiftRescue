import { Tabs } from "expo-router";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard"
        }}
      />
      <Tabs.Screen
        name="fire-detection"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
