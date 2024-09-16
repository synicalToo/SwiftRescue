import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity, Animated, Easing } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AEDLocs from "../screens/aed-locations";
import HelpNeeded from "../screens/helpneeded";
import SOS from "../screens/sos";
import SOSStatus from "../screens/sosstatus";

type RootStackParamList = {
  Home: undefined;
  AEDLocs: undefined;
  HelpNeeded: undefined;
  SOS: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Index({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;//こっから
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
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // 繰り返し
    };
  
    animate(); // アニメーションを開始
  }, [scaleAnim]);//ここまで変更点。まだ下にも変更点あるよ

  return (
    <SafeAreaView>
    <View style={styles.button}>
      <Button
        title="AED"
        color="red"
        onPress={() => navigation.navigate('AEDLocs')}
      />
      </View>
      <View style={styles.button}>
        <Button
        title="Help Needed Nearby"
        onPress={() => navigation.navigate('HelpNeeded')}
      />
      </View>
      <Animated.Text style={[styles.sosText, { transform: [{ scale: scaleAnim }] }]}>{/* このセクションも変更点 */}
        SOS
      </Animated.Text>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30, // Add horizontal padding
    paddingVertical: 10, // Add vertical padding
  },
  sosButton: {
    marginTop: 185,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    fontSize: 45,
    color: 'red',
    textAlign: 'center',
  }
})

const Stack = createNativeStackNavigator();

export default function ButtonNavigation() {
  return (
        <Stack.Navigator initialRouteName="Index">
        <Stack.Screen
          name="Home"
          component={Index}
        />
        <Stack.Screen
          name="AEDLocs" // Define AedLocs screen
          component={AEDLocs}
          options={{ title: 'AED Locations' }}
        />
        <Stack.Screen
          name="HelpNeeded"
          component={HelpNeeded}
          options={{ title: 'Help Needed Nearby' }}
        />
        <Stack.Screen
          name="SOS"
          component={SOS}
          options={{ title: 'Send SOS signal' }}
        />
        <Stack.Screen
          name="SOSStatus" // for redirection at HN
          component={SOSStatus}
        /> 
        </Stack.Navigator>
  );
}