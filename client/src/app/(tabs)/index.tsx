import React from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import usePost from '@hooks/usePost';

export default function TabIndex() {
  const { data, errorMsg, loading, postData } = usePost('/api/v1/detect');

  return (
    <View className='flex-1 justify-center items-center'>
      <Button title="Fetch Data" onPress={() => postData({ "area": "Ang Mo Kio" })} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {errorMsg ? (
        <Text className='text-red-500 text-xl'>{errorMsg}</Text>
      ) : (
        <Text className='text-neutral-500 text-lg font-semibold'>{data ? data.message : 'No data'}</Text>
      )}
    </View>
  );
};
