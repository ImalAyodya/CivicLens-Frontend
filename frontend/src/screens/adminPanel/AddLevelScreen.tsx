import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://localhost:5000/api/levels"; // your backend endpoint

const AddLevelScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Check backend connection on component mount
  React.useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://localhost:5000/api/levels', { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        setBackendStatus('disconnected');
        if (__DEV__) {
          console.log("Backend not available - running in development mode");
        }
      }
    };

    checkBackendConnection();
  }, []);

  const handleAddLevel = async () => {
    if (!name.trim() || !order.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields before saving.");
      return;
    }

    try {
      setLoading(true);
      
      // For development mode, simulate API call if backend is not available
      if (__DEV__) {
        try {
          await axios.post(API_URL, {
            name,
            order: Number(order),
          });
        } catch (networkError: any) {
          // If backend is not running, simulate success for development
          if (networkError.code === 'ERR_NETWORK' || networkError.message.includes('ERR_CONNECTION_REFUSED')) {
            console.log("Development mode: Backend not available. Simulating success.");
            console.log("Level data that would be sent:", {
              name,
              order: Number(order),
            });
            
            // Reset form
            setName("");
            setOrder("");
            
            // Show development success message
            Alert.alert(
              "Success (Dev Mode)", 
              "Level added successfully!\n(Backend not connected - simulated)",
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack()
                }
              ]
            );
            return;
          }
          throw networkError; // Re-throw if it's a different error
        }
      } else {
        // Production mode - require backend connection
        await axios.post(API_URL, {
          name,
          order: Number(order),
        });
      }
      
      // Reset form
      setName("");
      setOrder("");
      
      // Show success message with OK button, then navigate back
      Alert.alert(
        "Success", 
        "Level added successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err: any) {
      console.error("Error adding level:", err);
      
      let errorMessage = "Failed to add level. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = "Cannot connect to server. Please check if the backend is running on http://localhost:5000";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Level</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Backend Status Indicator */}
        {backendStatus === 'disconnected' && __DEV__ && (
          <View style={styles.statusBanner}>
            <Ionicons name="warning" size={16} color="#ff6b35" />
            <Text style={styles.statusText}>
              Backend disconnected - Running in development mode
            </Text>
          </View>
        )}
        
        <Text style={styles.label}>Level Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., National, Provincial, District"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Order (1 = top) *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="1"
          value={order}
          onChangeText={setOrder}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={handleAddLevel}
          disabled={loading}
        >
          {loading ? (
            <Ionicons name="hourglass" size={20} color="white" style={styles.buttonIcon} />
          ) : (
            <Ionicons name="add-circle" size={20} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>
            {loading ? "Adding..." : "Add Level"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
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
  placeholder: {
    width: 40, // Same width as back button to center the title
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: { 
    marginTop: 16, 
    marginBottom: 8,
    fontWeight: "bold", 
    fontSize: 16,
    color: '#333'
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#fff',
    fontSize: 16,
  },
  btn: { 
    marginTop: 32,
    backgroundColor: "#007bff", 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white", 
    fontWeight: "bold",
    fontSize: 16,
  },
  btnDisabled: {
    backgroundColor: "#6c757d",
    opacity: 0.7,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
    flex: 1,
  }
});

export default AddLevelScreen;
