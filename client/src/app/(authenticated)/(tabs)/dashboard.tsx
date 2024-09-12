import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import useFetch from "@/hooks/useFetch";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Page() {
  const { data, errorMsg, loading, fetchData } = useFetch(
    "/api/v1/testFetchData"
  );

  return (
    <View className="flex-1 justify-center items-center">
      <StatusBar style="dark" />
      <Button title="Fetch Data" onPress={() => fetchData()} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {errorMsg ? (
        <Text className="text-red-500 text-xl">{errorMsg}</Text>
      ) : (
        <Text className="text-neutral-500 text-lg font-semibold">
          {data ? data.message : "No data"}
        </Text>
      )}

      <TouchableOpacity
        className="p-2 m-2 bg-cyan-100"
        onPress={() =>
          router.navigate("/(authenticated)/screens/aed-locations")
        }
      >
        <Text>Go to aed locations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-2 m-2 bg-cyan-100"
        onPress={() => router.navigate("/(authenticated)/screens/sos-signals")}
      >
        <Text>Go to sos signals</Text>
      </TouchableOpacity>
    </View>
  );
}
