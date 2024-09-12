import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function Page() {
  return (
    <View className="flex-1 justify-center items-center">
      <StatusBar style="dark" />

      <Text className="text-lg font-semibold">aed locations page</Text>
    </View>
  );
}
