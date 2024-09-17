import React, { useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { SOS_DB } from '@/services/FirebaseConfig';

interface SOSRequest {
  id: string;
  name?: string;
  details?: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  audioUrl?: string; // Add audio URL if available
}

const HelpNeeded: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSosRequests = async () => {
      try {
        const sosCollectionRef = collection(SOS_DB, 'sosRequests');
        const sosQuery = query(sosCollectionRef);
        const querySnapshot = await getDocs(sosQuery);
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: new Date(doc.data().timestamp.seconds * 1000),
        })) as SOSRequest[];

        setSosRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching SOS requests:', error);
        setErrorMessage('Error loading requests');
      }
    };

    fetchSosRequests();
  }, []);

  const handleSosRequestPress = (request: SOSRequest) => {
    navigation.navigate('SOSStatus', {
      request: {
        ...request,
        timestamp: request.timestamp.toISOString(), // Serialize timestamp
      },
    });
  };

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.saveAreaContainer}>
      <StatusBar style="auto" />
      {sosRequests.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.text}>No SOS requests</Text>
        </View>
      ) : (
        <FlatList
          data={sosRequests}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item, index }) => ( // index を追加
            <TouchableOpacity style={styles.requestItem} onPress={() => handleSosRequestPress(item)}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{index + 1}</Text>
              </View>
              <Text style={styles.text}>
                {item.name ? `${item.name}: \n` : ''}
                {item.details ? `${item.details} - \n` : ''}
                {new Date(item.timestamp).toLocaleString() + `\n`}(Tap for details)
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  saveAreaContainer: {
    flex: 1,
    justifyContent: 'center', //ここと
    alignItems: 'center',//ここと
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',//ここと
    color: '#ffffff', //ここと
  },
  separator: {
    height: 4,
    backgroundColor: '#ddd',
  },
  requestItem: {//こっから
    paddingTop: 30, 
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginTop: 30,
    marginHorizontal: 15,
    backgroundColor: '#00bfff',
    borderRadius: 25, 
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    position: 'relative', 
  },
  circle: {
    position: 'absolute', 
    top: -15, 
    left: -10, 
    width: 45, 
    height: 45, 
    borderRadius: 20, 
    backgroundColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1e90ff',
    zIndex: 1,
  },
  circleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 25,
  },//ここまで変更
});

export default HelpNeeded;
