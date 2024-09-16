import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
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
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

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
  const scaleAnim = useRef(new Animated.Value(1)).current; //こっから
  useEffect(() => {
    const animate = () => {
      scaleAnim.setValue(1); // 初期化
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1, // または変更した値
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // 繰り返し
    };

    animate(); // アニメーションを開始
  }, [scaleAnim]);
  return (
    <SafeAreaView>
      <View style={styles.flexBox}>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate("AEDLocs")}
          >
            <MaterialIcons
              name="monitor-heart"
              size={20}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.iconText}>AED</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate("HelpNeeded")}
          >
            <SimpleLineIcons
              name="location-pin"
              size={20}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.iconText}>LOCATION</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.requestSOS}>
        <TouchableOpacity onPress={() => navigation.navigate("SOS")}>
          <Animated.Text
            style={[styles.sosText, { transform: [{ scale: scaleAnim }] }]}
          >
            SOS
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  requestSOS: {
    backgroundColor: "white",
    display: "flex",
    width: "100%",
    height: "50%",
    alignItems: "center",
  },
  sosText: {
    textAlign: "center",
    marginTop: 100,
    borderWidth: 3,
    borderColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 60,
    color: "red",
    borderRadius: "20%",
    fontWeight: "bold",
  },
  flexBox: {
    paddingHorizontal: 30,
    paddingVertical: 100,
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    backgroundColor: "blue",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  box: {
    width: "50%",
  },
  buttonWrapper: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    borderWidth: 5, // 枠線を追加
    borderColor: "black", // 枠線の色
    padding: 10,
    gap: 5, // 内側の余白
    backgroundColor: "white", // 背景色
    borderRadius: "20%",
  },
  iconText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    fontSize: 60,
  },
});

const Stack = createNativeStackNavigator();

export default function ButtonNavigation() {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Home" component={Index} />
      <Stack.Screen
        name="AEDLocs" // Define AedLocs screen
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
      <Stack.Screen
        name="SOSStatus" // for redirection at HN
        component={SOSStatus}
      />
    </Stack.Navigator>
  );
}
