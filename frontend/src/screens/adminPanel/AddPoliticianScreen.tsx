import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddPoliticianForm'>;

type Party = {
  _id: string;
  fullName: string;
  abbreviation: string;
};

type Role = {
  _id: string;
  title: string;
  level: string;
};

const API_BASE_URL = "http://localhost:5000";

const AddPoliticianScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [parties, setParties] = useState<Party[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    party: "",
    role: "",
    constituency: "",
    profileImage: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    status: "Active"
  });

  // Check backend connection and fetch data
  useEffect(() => {
    const checkBackendAndFetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/api/politicians`, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setBackendStatus('connected');
          await fetchParties();
          await fetchRoles();
        } else {
          setBackendStatus('disconnected');
          loadDummyData();
        }
      } catch (error) {
        setBackendStatus('disconnected');
        loadDummyData();
        if (__DEV__) {
          console.log("Backend not available - using mock data");
        }
      }
    };

    checkBackendAndFetchData();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/parties`);
      setParties(response.data || []);
    } catch (error) {
      console.error("Error fetching parties:", error);
      loadDummyParties();
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/roles`);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      loadDummyRoles();
    }
  };

  const loadDummyData = () => {
    loadDummyParties();
    loadDummyRoles();
  };

  const loadDummyParties = () => {
    const dummyParties = [
      { _id: "1", fullName: "United National Party", abbreviation: "UNP" },
      { _id: "2", fullName: "Sri Lanka Podujana Peramuna", abbreviation: "SLPP" },
      { _id: "3", fullName: "Samagi Jana Balawegaya", abbreviation: "SJB" },
      { _id: "4", fullName: "Janatha Vimukthi Peramuna", abbreviation: "JVP" },
      { _id: "5", fullName: "Tamil National Alliance", abbreviation: "TNA" }
    ];
    setParties(dummyParties);
  };

  const loadDummyRoles = () => {
    const dummyRoles = [
      { _id: "1", title: "President", level: "National" },
      { _id: "2", title: "Prime Minister", level: "National" },
      { _id: "3", title: "Minister", level: "National" },
      { _id: "4", title: "Member of Parliament", level: "MP" },
      { _id: "5", title: "Provincial Councilor", level: "Provincial" },
      { _id: "6", title: "Mayor", level: "Local" }
    ];
    setRoles(dummyRoles);
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setForm({ ...form, profileImage: result.assets[0].uri });
    }
  };

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    // Validate form data
    if (!form.firstName.trim() || !form.lastName.trim() || !form.party.trim()) {
      Alert.alert("Validation Error", "Please fill in at least the First Name, Last Name, and Party fields");
      return;
    }

    // Email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    // Phone validation
    if (form.phoneNumber && !/^\+?[\d\s-()]+$/.test(form.phoneNumber)) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }

    if (!form.profileImage) {
      Alert.alert("Validation Error", "Please upload a profile image");
      return;
    }

    if (!form.role) {
      Alert.alert("Validation Error", "Please select a role");
      return;
    }

    setLoading(true);

    try {
      // Create FormData to send file and other data to backend
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('fullName', `${form.firstName} ${form.lastName}`);
      formData.append('party', form.party);
      formData.append('role', form.role);
      formData.append('constituency', form.constituency);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('email', form.email);
      formData.append('dateOfBirth', form.dateOfBirth);
      formData.append('address', form.address);
      formData.append('status', form.status);

      // Add the profile image file
      const uriParts = form.profileImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // For web, we need to fetch the blob first
      const response = await fetch(form.profileImage);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `politician-profile-${Date.now()}.${fileType}`, {
        type: `image/${fileType}`,
      });
      
      formData.append('profileImage', file);

      // Send to backend - backend will handle Cloudinary upload
      const uploadResponse = await fetch(`${API_BASE_URL}/api/politicians`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || "Error creating politician");
      }

      const result = await uploadResponse.json();
      console.log("Politician created:", result);
      
      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        party: "",
        role: "",
        constituency: "",
        profileImage: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: "",
        address: "",
        status: "Active"
      });
      
      // Show success message with OK button, then navigate back
      Alert.alert(
        "Success", 
        "Politician added successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      console.error("Error:", error);
      
      // Fallback for development mode
      if (backendStatus !== 'connected' && __DEV__) {
        console.log("Development mode: Backend not available. Politician data:");
        console.log(form);
        Alert.alert(
          "Development Mode", 
          "Backend not available. Politician data logged to console.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
        Alert.alert("Error", errorMessage);
      }
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
        <Text style={styles.headerTitle}>Add New Politician</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Backend Status Indicator */}
      {backendStatus === 'checking' && (
        <View style={[styles.statusBanner, styles.statusChecking]}>
          <Ionicons name="sync" size={16} color="#666" />
          <Text style={styles.statusText}>Checking backend connection...</Text>
        </View>
      )}
      {backendStatus === 'connected' && (
        <View style={[styles.statusBanner, styles.statusConnected]}>
          <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
          <Text style={styles.statusText}>Backend connected</Text>
        </View>
      )}
      {backendStatus === 'disconnected' && (
        <View style={[styles.statusBanner, styles.statusDisconnected]}>
          <Ionicons name="warning" size={16} color="#f59e0b" />
          <Text style={styles.statusText}>Using offline mode</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* Profile Image Upload */}
          <Text style={styles.label}>Profile Image *</Text>
          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {form.profileImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: form.profileImage }} style={styles.previewImage} />
                <Text style={styles.changeImageText}>Tap to change image</Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#ccc" />
                <Text style={styles.uploadText}>Tap to upload profile image</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.label}>First Name *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter first name"
            value={form.firstName}
            onChangeText={v => handleChange("firstName", v)} 
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter last name"
            value={form.lastName}
            onChangeText={v => handleChange("lastName", v)} 
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD (e.g., 1975-06-15)"
            value={form.dateOfBirth}
            onChangeText={v => handleChange("dateOfBirth", v)} 
          />


        </View>

        {/* Political Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Political Information</Text>
          
          <Text style={styles.label}>Party *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.party}
              onValueChange={(v: string) => handleChange("party", v)}
              style={styles.picker}
            >
              <Picker.Item label="Select a party" value="" />
              {parties.map(party => (
                <Picker.Item 
                  key={party._id} 
                  label={`${party.fullName} (${party.abbreviation})`} 
                  value={party.abbreviation} 
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Role *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.role}
              onValueChange={(v: string) => handleChange("role", v)}
              style={styles.picker}
            >
              <Picker.Item label="Select a role" value="" />
              {roles.map(role => (
                <Picker.Item 
                  key={role._id} 
                  label={`${role.title} (${role.level})`} 
                  value={role.title} 
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Constituency</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., Colombo District, Kandy District"
            value={form.constituency}
            onChangeText={v => handleChange("constituency", v)} 
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.status}
              onValueChange={(v: string) => handleChange("status", v)}
              style={styles.picker}
            >
              <Picker.Item label="Active" value="Active" />
              <Picker.Item label="Inactive" value="Inactive" />
              <Picker.Item label="Pending" value="Pending" />
            </Picker>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="politician@example.com"
            value={form.email}
            onChangeText={v => handleChange("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="+94771234567"
            value={form.phoneNumber}
            onChangeText={v => handleChange("phoneNumber", v)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Enter full address"
            value={form.address}
            onChangeText={v => handleChange("address", v)}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity 
          style={[styles.btn, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Ionicons name="refresh" size={20} color="white" style={[styles.buttonIcon, { transform: [{ rotate: '45deg' }] }]} />
          ) : (
            <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>
            {loading ? 'Adding Politician...' : 'Add Politician'}
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingBottom: 8,
  },
  label: { 
    marginTop: 12, 
    marginBottom: 8,
    fontWeight: "bold", 
    fontSize: 14,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: "#3498db", 
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
  // Backend status styles
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  statusChecking: {
    backgroundColor: '#f3f4f6',
  },
  statusConnected: {
    backgroundColor: '#dcfce7',
  },
  statusDisconnected: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  // Image upload styles
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changeImageText: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 8,
  }
});

export default AddPoliticianScreen;