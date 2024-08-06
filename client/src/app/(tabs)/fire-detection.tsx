import { useEffect, useRef, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import usePost from '@hooks/usePost';
import { useRouter } from 'expo-router';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function TabFireDetection() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back')
  const [hasPermission, requestPermission] = useCameraPermissions();
  const { data, errorMsg, loading, postData } = usePost('/api/v1/detect');

  let cameraOptions = {
    quality: 1,
    base64: true,
    exif: true,
  }

  useEffect(() => {
    if (errorMsg) {
      Alert.alert("An error has occured", errorMsg);
    }
  }, [errorMsg])

  useEffect(() => {
    if (data) {
      Alert.alert("Fire detection AI", data.message);
    }
  }, [data])

  if (!hasPermission) {
    return <View />;
  }

  if (!hasPermission.granted) {
    return (
      <View className='flex-1 justify-center'>
        <Text>Allow camera permission to use this feature.</Text>
        <Button title='Grant permission' onPress={requestPermission}></Button>
      </View>
    );
  }

  function onCloseButtonPress() {
    router.replace("/");
  }

  async function onShuttlePress() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(cameraOptions);

      postData({ image: photo?.base64, location: { lat: 1.424710, long: 103.852120 } })
    }
  }

  return (
    <SafeAreaView className='flex-1 justify-center bg-black'>
      <View className='flex-1 rounded-3xl mx-1 overflow-hidden'>
        <CameraView className='flex-1' facing={facing} ref={cameraRef}>
          <View className='flex-1 pt-5 px-5'>
            <TouchableOpacity onPress={onCloseButtonPress}>
              <Ionicons name="close-outline" size={48} color="white" />
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator className='flex-1 justify-center items-center' size="large" color="#FFFFFF" />}

          <View className='flex-1 items-center flex-col-reverse pb-5'>
            <TouchableOpacity onPress={onShuttlePress}>
              <Ionicons name='camera-outline' size={48} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};
