import React, { useRef, useState } from 'react';
import { Button, View, Text, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import usePost from '@/hooks/usePost';

export default function LiveStreamingScreen() {
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [serverImage, setServerImage] = useState<string | null>(null); // To store the server image
    const cameraRef = useRef<CameraView>(null);
    const isStreaming = useRef(false);
    const { data, errorMsg, loading, postData } = usePost("/api/v1/pose-detection");

    const [hasPermission, requestPermission] = useCameraPermissions();

    // Function to start streaming and get the server response image
    const startStreaming = async () => {
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

                    // If we get a valid image from the server, display it
                    if (data) {
                        setServerImage(`data:image/jpeg;base64,${data.processed_image}`);
                    }

                    // Add a random delay (1-2 seconds)
                    const randomDelay = Math.random() * 1000 + 2000;
                    await new Promise(resolve => setTimeout(resolve, randomDelay));
                }
            }
        }
    };

    // Function to stop streaming and reset to camera preview
    const stopStreaming = () => {
        isStreaming.current = false; // Stop streaming
        setServerImage(null); // Reset the server image and show the camera preview
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (!hasPermission.granted) {
        return <Text>No access to camera</Text>;
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
                onCameraReady={() => setCameraReady(true)}
            />

            <View style={styles.buttonContainer}>
                <Button title="Start Streaming" onPress={startStreaming} />
                <Button title="Stop Streaming" onPress={stopStreaming} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
});
