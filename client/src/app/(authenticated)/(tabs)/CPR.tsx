import React, { useRef, useState } from 'react';
import { Button, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import usePost from '@/hooks/usePost';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LiveStreamingScreen() {
    const isFocused = useIsFocused();
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [serverImage, setServerImage] = useState<string | null>(null); // To store the server image
    const cameraRef = useRef<CameraView>(null);
    const isStreaming = useRef(false);
    const [facing, setFacing] = useState<CameraType>("back");
    const { data, errorMsg, loading, postData } = usePost("/api/v1/CPR");
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [hasPermission, requestPermission] = useCameraPermissions();
    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const audioFiles: { [key: string]: any } = {
        'moveforward.mp3': require("../../../assets/audio/moveforward.mp3"),
        'straightenelbow.mp3': require("../../../assets/audio/straightenelbow.mp3"),
        'movebackward.mp3': require("../../../assets/audio/movebackward.mp3"),
    };

    const playSound = async (fileName: string) => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(audioFiles[fileName]);
        setSound(newSound);
        await newSound.playAsync();
    };

    // Function to start streaming and get the server response image
    async function startStreaming() {
        console.log("RUNNING BRO");

        if (isStreaming.current) {
            console.log("Streaming is already running");
            return;
        }

        if (cameraRef.current) {
            isStreaming.current = true; // Mark streaming as active
            while (isStreaming.current) {
                if (cameraReady) {
                    // Take a picture and send it to the server
                    const photo = await cameraRef.current.takePictureAsync({ base64: true, skipProcessing: true });
                    const base64Frame = photo?.base64;

                    await postData({ image: base64Frame });
                    if (photo && photo.base64) {
                        const response = await fetch("http://10.175.5.194:5000/api/v1/CPR", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ image: photo.base64 })
                        }
                        )
                        // If we get a valid image from the server, display it
                        if (data) {
                            setServerImage(`data:image/jpeg;base64,${data.processed_image}`);
                        }
                        const responseText = await response.text();
                        // Add a random delay (1-2 seconds)
                        const randomDelay = Math.random() * 1000 + 2000;
                        await new Promise(resolve => setTimeout(resolve, randomDelay));
                        try {
                            const responseData = JSON.parse(responseText)
                            console.log(responseData.bend_elbow);
                            if (responseData.bend_elbow) {
                                playSound("straightenelbow.mp3");
                            }
                            else if (responseData.backward) {
                                playSound("movebackward.mp3");
                            }
                            else if (responseData.forward) {
                                playSound("moveforward.mp3");
                            }
                        } catch (error) {
                            console.error("Error capturing frame:", error);
                        }
                    }
                }
            }
        }
    };

    // Function to stop streaming and reset to camera preview
    const stopStreaming = () => {
        console.log("STOPPING");

        isStreaming.current = false; // Stop streaming
        setServerImage(null); // Reset the server image and show the camera preview
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (!hasPermission.granted) {
        return <Text>No access to camera</Text>;
    }

    // bring user back to dashboard
    async function onCloseButtonPress() {
        if (cameraRef.current) {
            try {
                await cameraRef.current.pausePreview;
            } catch (error) { }
        }
        router.replace("/(authenticated)/(tabs)/dashboard");
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Conditionally render CameraView or the image from server */}
            {/* {serverImage ? (
                <Image
                    style={{ flex: 1 }}
                    source={{ uri: serverImage }} // Display server image
                    resizeMode="contain"
                />
            ) : (
            )} */}

            <CameraView
                style={{ flex: 1 }}
                ref={cameraRef}
                onCameraReady={() => setCameraReady(true)}>

                <View style={styles.headerActionButtons}>
                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.cameraSwitchButton}>
                        <Ionicons name="camera-reverse-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 pt-5 px-5">
                    <TouchableOpacity onPress={onCloseButtonPress}>
                        <Ionicons name="close-outline" size={48} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView>

            <View style={styles.buttonContainer}>
                <Button title="Start Streaming" onPress={startStreaming} />
                <Button title="Stop Streaming" onPress={stopStreaming} />
            </View>
        </View >
    );

    // return (
    //     <SafeAreaView className="flex-1 justify-center bg-black">
    //         <StatusBar style="dark" />
    //         <View className="flex-1 rounded-3xl mx-1 overflow-hidden">
    //             {isFocused && (
    //                 <CameraView className="flex-1" facing={facing} ref={cameraRef}>
    //                     <StatusBar style="light" />
    //                     <View className="flex-1 pt-5 px-5">
    //                         <TouchableOpacity onPress={onCloseButtonPress}>
    //                             <Ionicons name="close-outline" size={48} color="white" />
    //                         </TouchableOpacity>
    //                     </View>

    //                 </CameraView>
    //             )}
    //             <View style={styles.buttonContainer}>
    //                 <Button title="Start Streaming" onPress={testStream} />
    //                 <Button title="Stop Streaming" onPress={stopStreaming} />
    //                 {/* 
    //                         <TouchableOpacity onPress={startStreaming}>
    //                             <Text>Start Streaming</Text>
    //                         </TouchableOpacity> */}
    //             </View>
    //         </View>
    //     </SafeAreaView>
    // );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    saveAreaContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "black",
    },
    cameraContainer: {
        flex: 1,
        borderRadius: 25,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    headerActionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingHorizontal: 20,
    },
    footerActionButtons: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -20 }],
    },
    cameraSwitchButton: {
        marginTop: 20,
        padding: 10,
    },
    capturedImage: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -75 }],
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    audioButtonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginVertical: 50,
    }
});