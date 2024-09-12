import React from "react";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="aed-locations"
        options={{
          headerTitle: "AED Locations",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#E3DFE9",
                borderRadius: 16,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={20} color={"#716E75"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="sos-signals"
        options={{
          headerTitle: "SOS Signals",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#E3DFE9",
                borderRadius: 16,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={20} color={"#716E75"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
