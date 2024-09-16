import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import AEDLocs from "../screens/aed-locations";
import HelpNeeded from "../screens/helpneeded";
import SOS from "../screens/sos";
import SOSStatus from "../screens/sosstatus";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

type RootStackParamList = {
  Home: undefined;
  AEDLocs: undefined;
  HelpNeeded: undefined;
  SOS: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function Index({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      scaleAnim.setValue(1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.flexBox}>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate("AEDLocs")}
        >
          <MaterialCommunityIcons
            name="heart-flash"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.iconText}>Locate AED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate("HelpNeeded")}
        >
          <Entypo
            name="location"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.iconText}>Need Help</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.requestSOS, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate("SOS")}>
          <Animated.Text
            style={[styles.sosText, { transform: [{ scale: scaleAnim }] }]}
          >
            {'EMERGENCY'}{"\n"}
            {'SOS'}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#f0f0f5", // 明るいグレーで背景を落ち着かせる
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  requestSOS: {
    marginTop: 50,
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Androidのための影
  },
  sosText: {
    textAlign: "center",
    fontSize: 35, // 少しサイズを調整
    color: "white",
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    gap: 20,
  },
  buttonWrapper: {
    backgroundColor: "#4a90e2", // 鮮やかな青色
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: "40%",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 10,
  },
  icon: {
    fontSize: 40,
  },
});

const Stack = createNativeStackNavigator();

export default function ButtonNavigation() {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Home" component={Index} />
      <Stack.Screen
        name="AEDLocs"
        component={AEDLocs}
        options={{ title: "AED Locations" }}
      />
      <Stack.Screen
        name="HelpNeeded"
        component={HelpNeeded}
        options={{ title: "Help Needed Nearby" }}
      />
      <Stack.Screen
        name="SOS"
        component={SOS}
        options={{ title: "Send SOS signal" }}
      />
      <Stack.Screen name="SOSStatus" component={SOSStatus} />
    </Stack.Navigator>
  );
}
