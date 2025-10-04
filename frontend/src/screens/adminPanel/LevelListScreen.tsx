import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from "react-native";
import { TextInput, Button, Card, Text, IconButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

interface Level {
  _id: string;
  name: string;
  order: number;
}

const API_URL = "http://localhost:5000/api/levels"; // your backend endpoint

const LevelListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const fetchLevels = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    
    try {
      const res = await axios.get(API_URL);
      setLevels(res.data);
      setBackendStatus('connected');
      
      if (__DEV__) {
        console.log("Fetched levels:", res.data);
      }
    } catch (err: any) {
      console.error("Error fetching levels:", err);
      setBackendStatus('disconnected');
      
      if (__DEV__) {
        // In development mode, use mock data if backend is not available
        const mockLevels = [
          { _id: '1', name: 'National', order: 1 },
          { _id: '2', name: 'Provincial', order: 2 },
          { _id: '3', name: 'District', order: 3 },
          { _id: '4', name: 'Local', order: 4 }
        ];
        setLevels(mockLevels);
        console.log("Backend not available - using mock data");
      } else {
        // In production, show error message
        Alert.alert(
          "Connection Error",
          "Unable to fetch levels. Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: () => fetchLevels(true) },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const addLevel = async () => {
    if (!name || !order) return alert("Please fill all fields");
    setLoading(true);
    try {
      await axios.post(API_URL, { name, order: Number(order) });
      setName("");
      setOrder("");
      fetchLevels();
    } catch (err) {
      console.error(err);
      alert("Error adding level");
    } finally {
      setLoading(false);
    }
  };

  const deleteLevel = async (id: string, levelName: string) => {
    Alert.alert(
      "Delete Level",
      `Are you sure you want to delete "${levelName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              if (backendStatus === 'connected') {
                await axios.delete(`${API_URL}/${id}`);
                fetchLevels();
                Alert.alert("Success", "Level deleted successfully!");
              } else if (__DEV__) {
                // In development mode, simulate deletion
                setLevels(prev => prev.filter(level => level._id !== id));
                Alert.alert("Success (Dev Mode)", "Level deleted successfully!\n(Backend not connected - simulated)");
              }
            } catch (err: any) {
              console.error("Error deleting level:", err);
              Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to delete level. Please try again."
              );
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLevels();
  };

  useEffect(() => {
    fetchLevels(true);
  }, []);

  // Refresh data when screen comes into focus (e.g., after adding a new level)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLevels();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hierarchy Levels</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddLevel")} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.subtitle}>Manage political hierarchy levels</Text>
        {backendStatus === 'disconnected' && __DEV__ && (
          <View style={styles.statusBanner}>
            <Ionicons name="warning" size={16} color="#ff6b35" />
            <Text style={styles.statusText}>Backend disconnected - Using mock data</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading levels...</Text>
        </View>
      ) : (
        <FlatList
          data={levels.sort((a, b) => a.order - b.order)}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="layers-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hierarchy levels found</Text>
              <Text style={styles.emptySubtext}>
                Add your first level using the + button above
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.levelInfo}>
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderText}>{item.order}</Text>
                  </View>
                  <View style={styles.levelDetails}>
                    <Text style={styles.levelName}>{item.name}</Text>
                    <Text style={styles.levelOrder}>Level {item.order}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteLevel(item._id, item.name)}
                >
                  <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 4,
  },
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusContainer: {
    paddingHorizontal: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b35',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#856404',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  levelOrder: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff5f5',
  },
});

export default LevelListScreen;
