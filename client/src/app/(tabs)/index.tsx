import React from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import usePost from '@hooks/usePost';

const TabOneScreen = () => {
  const { data, errorMsg, loading, postData } = usePost('/api/v1/detect');

  return (
    <View style={styles.container}>
      <Button title="Fetch Data" onPress={() => postData({ "area": "Ang Mo Kio" })} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <Text>{data ? data.message : 'No data'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});

export default TabOneScreen;
