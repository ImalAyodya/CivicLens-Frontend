import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddRole'>;

const API_URL = "http://localhost:5000/api/roles";

const AddRoleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [form, setForm] = useState({
    title: "",
    level: "MP",
    startDate: "",
    endDate: "",
    region: ""
  });
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  // Check backend connection on component mount
  React.useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://localhost:5000/api/roles', { 
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

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.startDate.trim()) {
      Alert.alert("Validation Error", "Please fill in at least the Title and Start Date fields");
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.startDate)) {
      Alert.alert("Invalid Date", "Please enter start date in YYYY-MM-DD format");
      return;
    }

    if (form.endDate && !dateRegex.test(form.endDate)) {
      Alert.alert("Invalid Date", "Please enter end date in YYYY-MM-DD format");
      return;
    }

    try {
      setLoading(true);
      
      // For development mode, simulate API call if backend is not available
      if (__DEV__) {
        try {
          await axios.post(API_URL, form);
        } catch (networkError: any) {
          // If backend is not running, simulate success for development
          if (networkError.code === 'ERR_NETWORK' || networkError.message.includes('ERR_CONNECTION_REFUSED')) {
            console.log("Development mode: Backend not available. Simulating success.");
            console.log("Role data that would be sent:", form);
            
            // Reset form
            setForm({
              title: "",
              level: "MP",
              startDate: "",
              endDate: "",
              region: ""
            });
            
            // Show development success message
            Alert.alert(
              "Success (Dev Mode)", 
              "Role added successfully!\n(Backend not connected - simulated)",
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
        await axios.post(API_URL, form);
      }
      
      // Reset form
      setForm({
        title: "",
        level: "MP",
        startDate: "",
        endDate: "",
        region: ""
      });
      
      // Show success message with OK button, then navigate back
      Alert.alert(
        "Success", 
        "Role added successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err: any) {
      console.error("Error adding role:", err);
      
      let errorMessage = "Failed to add role. Please try again.";
      
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
        <Text style={styles.headerTitle}>Add New Role</Text>
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
        
        <Text style={styles.label}>Role Title *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter role title (e.g., Minister of Health)"
          value={form.title}
          onChangeText={v => handleChange("title", v)} 
        />

        <Text style={styles.label}>Level *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.level}
            onValueChange={(v: string) => handleChange("level", v)}
            style={styles.picker}
          >
            <Picker.Item label="President" value="President" />
            <Picker.Item label="Prime Minister" value="PrimeMinister" />
            <Picker.Item label="Cabinet Minister" value="CabinetMinister" />
            <Picker.Item label="MP" value="MP" />
            <Picker.Item label="Provincial Member" value="ProvincialMember" />
            <Picker.Item label="Local Authority Member" value="LocalAuthorityMember" />
          </Picker>
        </View>

        <Text style={styles.label}>Start Date *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="YYYY-MM-DD (e.g., 2023-01-15)"
          value={form.startDate}
          onChangeText={v => handleChange("startDate", v)} 
        />

        <Text style={styles.label}>End Date</Text>
        <TextInput 
          style={styles.input} 
          placeholder="YYYY-MM-DD (leave empty if current)"
          value={form.endDate}
          onChangeText={v => handleChange("endDate", v)} 
        />

        <Text style={styles.label}>Region</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Colombo District, Western Province"
          value={form.region}
          onChangeText={v => handleChange("region", v)} 
        />

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Ionicons name="hourglass" size={20} color="white" style={styles.buttonIcon} />
          ) : (
            <Ionicons name="briefcase" size={20} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>
            {loading ? "Adding..." : "Add Role"}
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
    width: 40,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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

export default AddRoleScreen;
