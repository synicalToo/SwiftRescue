import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
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
      <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('SOS') }>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    
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