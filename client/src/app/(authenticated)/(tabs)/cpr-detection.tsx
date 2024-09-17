import { View, Text, TouchableOpacity, Alert, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import usePost from "@/hooks/usePost";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Audio } from "expo-av";

export default function PoseDetectionPage() {
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const isStreaming = useRef<boolean>(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [serverImage, setServerImage] = useState<string | null>(null);
  const { data, errorMsg, loading, postData } = usePost("/api/v1/cpr");

  // camera persmission still loading
  if (!hasPermission) {
    return <View />;
  }

  // camera permission not granted by user
  if (!hasPermission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="flex-1 justify-center text-center text-base">
          Allow camera permission to use this feature.
        </Text>
        <Button title="Grant permission" onPress={requestPermission}></Button>
      </View>
    );
  }

  // bring user back to dashboard
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function onCloseButtonPress() {
    if (cameraRef.current) {
      try {
        await cameraRef.current.pausePreview;
      } catch (error) {}
    }
    router.replace("/(authenticated)/(tabs)/dashboard");
  }

  const audioFiles: { [key: string]: any } = {
    move_forward: require("../../../assets/audio/moveforward.mp3"),
    move_backward: require("../../../assets/audio/movebackward.mp3"),
    straighten_elbow: require("../../../assets/audio/straightenelbow.mp3"),
  };

  const playSound = async (fileName: string) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      audioFiles[fileName]
    );
    setSound(newSound);
    await newSound.playAsync();
  };

  function stopStreaming() {
    isStreaming.current = false;
    setServerImage(null);
    console.log("Streaming stopped");
  }

  async function startStreaming() {
    console.log("Streaming started");
    if (isStreaming.current) {
      console.log("Streaming is already running");
      return;
    }

    if (cameraRef.current) {
      isStreaming.current = true; // Mark streaming as active
      while (isStreaming.current && cameraReady) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          skipProcessing: true,
        });

        const base64Frame = photo?.base64;

        if (base64Frame) {
          postData({ image: base64Frame });

          // If we get a valid image from the server, display it
          if (data?.processed_image) {
            setServerImage(`data:image/jpeg;base64,${data.processed_image}`);
          }

          // Handle sounds based on server response
          if (data?.sound) {
            if (data.sound.straighten_elbow) {
              playSound("straighten_elbow");
            } else if (data.sound.move_forward) {
              playSound("move_forward");
            } else if (data.sound.move_backward) {
              playSound("move_backward");
            }
          }

          // Add a random delay (1-2 seconds) between frames
          const randomDelay = Math.random() * 1000 + 2000;
          await new Promise((resolve) => setTimeout(resolve, randomDelay));
        }
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-black">
      <StatusBar style="dark" />
      <View className="flex-1 rounded-3xl mx-1 overflow-hidden">
        {isFocused && (
          <CameraView
            className="flex-1"
            facing={facing}
            ref={cameraRef}
            onCameraReady={() => setCameraReady(true)}
          >
            <StatusBar style="light" />

            <View className="flex-1 flex-row justify-between pt-5 px-5">
              <TouchableOpacity onPress={onCloseButtonPress}>
                <Ionicons name="close-outline" size={48} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleCameraFacing}>
                <Ionicons
                  name="camera-reverse-outline"
                  size={48}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-1 flex-row justify-center items-end pb-5">
              {/* <TouchableOpacity onPress={onToggleStreaming}>
                {isStreaming ? (
                  <FontAwesome6 name="stop-circle" size={52} color="white" />
                ) : (
                  <FontAwesome6 name="play-circle" size={52} color="white" />
                )}
              </TouchableOpacity> */}
              <Button title="Start Streaming" onPress={startStreaming} />
              <Button title="Stop Streaming" onPress={stopStreaming} />
            </View>
          </CameraView>
        )}
      </View>
    </SafeAreaView>
  );
}
