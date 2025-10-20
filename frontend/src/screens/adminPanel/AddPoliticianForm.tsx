import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from "react-native";
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

const AddPoliticianForm: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [parties, setParties] = useState<Party[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    party: "",
    currentRole: "",
    region: "",
    profileImage: "", // will store local image URI
    dateOfBirth: "",
    yearsOfService: "",
    achievements: ""
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // --- Check backend + fetch data ---
  useEffect(() => {
    const checkBackendAndFetchData = async () => {
      try {
        // Use parties endpoint to check backend connectivity since we need it anyway
        const res = await fetch(`${API_BASE_URL}/api/parties`);
        if (res.ok) {
          setBackendStatus("connected");
          // Parse the response to get parties data
          const partiesData = await res.json();
          setParties(partiesData || []);
          // Now fetch roles
          await fetchRoles();
        } else {
          setBackendStatus("disconnected");
          loadDummyData();
        }
      } catch (err) {
        setBackendStatus("disconnected");
        loadDummyData();
      }
    };
    checkBackendAndFetchData();
  }, []);

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/parties`);
      setParties(res.data || []);
    } catch {
      loadDummyParties();
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/roles`);
      
      if (res.data && Array.isArray(res.data)) {
        // Process roles to fetch level names for ObjectIds
        const processedRoles = await Promise.all(
          res.data.map(async (role: any) => {
            let levelName = 'Unknown Level';
            
            if (__DEV__) {
              console.log('Processing role level for AddPolitician:', role.title, 'Level ID:', role.level);
            }
            
            // If level is an ObjectId string, fetch the level details
            if (role.level && typeof role.level === 'string') {
              const isObjectId = /^[0-9a-f]{24}$/i.test(role.level);
              
              if (isObjectId) {
                try {
                  // Fetch level details from the levels endpoint
                  const levelResponse = await axios.get(`${API_BASE_URL}/api/levels/${role.level}`);
                  levelName = levelResponse.data?.name || 'Political Role';
                  
                  if (__DEV__) {
                    console.log('Fetched level name for role', role.title, ':', levelName);
                  }
                } catch (levelError) {
                  console.error('Error fetching level details for role:', role.title, levelError);
                  levelName = 'Political Role';
                }
              } else {
                // If it's not an ObjectId, use it directly
                levelName = role.level;
              }
            } else if (typeof role.level === 'object' && role.level?.name) {
              // Handle if level is already populated as an object
              levelName = role.level.name;
            }
            
            return {
              _id: role._id,
              title: role.title,
              level: levelName
            };
          })
        );
        
        setRoles(processedRoles);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      loadDummyRoles();
    }
  };

  const loadDummyData = () => {
    loadDummyParties();
    loadDummyRoles();
  };

  const loadDummyParties = () => {
    setParties([
      { _id: "1", fullName: "United National Party", abbreviation: "UNP" },
      { _id: "2", fullName: "Sri Lanka Podujana Peramuna", abbreviation: "SLPP" },
      { _id: "3", fullName: "Samagi Jana Balawegaya", abbreviation: "SJB" },
    ]);
  };

  const loadDummyRoles = () => {
    setRoles([
      { _id: "1", title: "President", level: "National" },
      { _id: "2", title: "Prime Minister", level: "National" },
      { _id: "3", title: "Member of Parliament", level: "National" },
    ]);
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
      // Store the local URI - we'll upload it with the form submission
      setForm({ ...form, profileImage: result.assets[0].uri });
    }
  };

  // --- Submit ---
  const handleSubmit = async () => {
    // Validate form data
    if (!form.firstName.trim() || !form.lastName.trim() || !form.party.trim()) {
      Alert.alert("Validation Error", "Please fill in at least the First Name, Last Name, and Party fields");
      return;
    }

    if (!form.profileImage) {
      Alert.alert("Validation Error", "Please upload a profile image");
      return;
    }

    if (!form.currentRole) {
      Alert.alert("Validation Error", "Please select a role");
      return;
    }

    if (form.yearsOfService && isNaN(Number(form.yearsOfService))) {
      Alert.alert("Validation Error", "Years of service must be a number");
      return;
    }

    setLoading(true);

    try {
      // Create FormData to send file and other data to backend
      const formData = new FormData();
      
      // Map form fields to backend schema
      formData.append('name', `${form.firstName} ${form.lastName}`);
      if (form.dateOfBirth) {
        formData.append('dateOfBirth', form.dateOfBirth);
      }
      formData.append('region', form.region);
      if (form.yearsOfService) {
        formData.append('yearsOfService', form.yearsOfService);
      }
      
      // Find the selected party and role objects to get their IDs
      const selectedParty = parties.find(p => p.abbreviation === form.party);
      const selectedRole = roles.find(r => r.title === form.currentRole);
      
      if (selectedParty) {
        formData.append('party', selectedParty._id);
      }
      if (selectedRole) {
        formData.append('currentRole', selectedRole._id);
      }
      
      // Add achievements as comma-separated string (backend will split it)
      if (form.achievements.trim()) {
        formData.append('achievements', form.achievements.trim());
      }

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
      
      // Use 'image' field name to match backend schema
      formData.append('image', file);

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
        currentRole: "",
        region: "",
        profileImage: "",
        dateOfBirth: "",
        yearsOfService: "",
        achievements: ""
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



      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            onChangeText={(val) => handleChange("firstName", val)}
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            value={form.lastName}
            onChangeText={(val) => handleChange("lastName", val)}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g., 1975-06-15)"
            value={form.dateOfBirth}
            onChangeText={(val) => handleChange("dateOfBirth", val)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Political Information</Text>
          
          <Text style={styles.label}>Party *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.party}
              onValueChange={(val: string) => handleChange("party", val)}
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
              selectedValue={form.currentRole}
              onValueChange={(val: string) => handleChange("currentRole", val)}
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

          <Text style={styles.label}>Region/Constituency</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Colombo District, Kandy"
            value={form.region}
            onChangeText={(val) => handleChange("region", val)}
          />

          <Text style={styles.label}>Years of Service</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            value={form.yearsOfService}
            onChangeText={(val) => handleChange("yearsOfService", val)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Achievements</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter achievements (comma-separated)"
            value={form.achievements}
            onChangeText={(val) => handleChange("achievements", val)}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={loading ? "Adding politician, please wait" : "Add politician"}
        >
          {loading ? (
            <Ionicons name="sync" size={20} color="white" style={[styles.buttonIcon, { opacity: 0.7 }]} />
          ) : (
            <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>
            {loading ? "Adding Politician..." : "Add Politician"}
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
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  changeImageText: {
    color: '#666',
    fontSize: 12,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
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
  btnDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white", 
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default AddPoliticianForm;

// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from 'expo-image-picker';
// import axios from "axios";
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootStackParamList } from '../../navigation/types';
// import { Politician } from "../../types/Politician";

// type NavigationProp = StackNavigationProp<RootStackParamList, 'AddPoliticianForm'>;

// type Party = {
//   _id: string;
//   fullName: string;
//   abbreviation: string;
// };

// type Role = {
//   _id: string;
//   title: string;
//   level: string;
// };

// const API_BASE_URL = "http://localhost:5000";

// const AddPoliticianForm: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [parties, setParties] = useState<Party[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     party: "",
//     currentRole: "",
//     region: "",
//     profileImage: "",
//     dateOfBirth: "",
//     yearsOfService: "",
//     achievements: ""
//   });

//   const handleChange = (key: string, value: string) => {
//     setForm({ ...form, [key]: value });
//   };

//   // Check backend connection and fetch data
//   useEffect(() => {
//     const checkBackendAndFetchData = async () => {
//       try {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 3000);
        
//         const response = await fetch(`${API_BASE_URL}/health`, { 
//           method: 'GET',
//           signal: controller.signal
//         });
        
//         clearTimeout(timeoutId);
        
//         if (response.ok) {
//           setBackendStatus('connected');
//           await fetchParties();
//           await fetchRoles();
//         } else {
//           setBackendStatus('disconnected');
//           loadDummyData();
//         }
//       } catch (error) {
//         setBackendStatus('disconnected');
//         loadDummyData();
//         if (__DEV__) {
//           console.log("Backend not available - using mock data");
//         }
//       }
//     };

//     checkBackendAndFetchData();
//   }, []);

//   const fetchParties = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/parties`);
//       setParties(response.data || []);
//     } catch (error) {
//       console.error("Error fetching parties:", error);
//       loadDummyParties();
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/roles`);
//       setRoles(response.data || []);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       loadDummyRoles();
//     }
//   };

//   const loadDummyData = () => {
//     loadDummyParties();
//     loadDummyRoles();
//   };

//   const loadDummyParties = () => {
//     const dummyParties = [
//       { _id: "1", fullName: "United National Party", abbreviation: "UNP" },
//       { _id: "2", fullName: "Sri Lanka Podujana Peramuna", abbreviation: "SLPP" },
//       { _id: "3", fullName: "Samagi Jana Balawegaya", abbreviation: "SJB" },
//       { _id: "4", fullName: "Janatha Vimukthi Peramuna", abbreviation: "JVP" },
//       { _id: "5", fullName: "Tamil National Alliance", abbreviation: "TNA" }
//     ];
//     setParties(dummyParties);
//   };

//   const loadDummyRoles = () => {
//     const dummyRoles = [
//       { _id: "1", title: "President", level: "National" },
//       { _id: "2", title: "Prime Minister", level: "National" },
//       { _id: "3", title: "Minister", level: "National" },
//       { _id: "4", title: "Member of Parliament", level: "MP" },
//       { _id: "5", title: "Provincial Councilor", level: "Provincial" },
//       { _id: "6", title: "Mayor", level: "Local" }
//     ];
//     setRoles(dummyRoles);
//   };

//   const pickImage = async () => {
//     // Request permission to access media library
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
//       return;
//     }

//     // Launch image picker
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets[0]) {
//       setForm({ ...form, profileImage: result.assets[0].uri });
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate form data
//     if (!form.firstName?.trim() || !form.lastName?.trim() || !form.party?.trim()) {
//       Alert.alert("Validation Error", "Please fill in at least the First Name, Last Name, and Party fields");
//       return;
//     }

//     // Years of service validation (should be a number)
//     if (form.yearsOfService && isNaN(Number(form.yearsOfService))) {
//       Alert.alert("Validation Error", "Years of service must be a valid number");
//       return;
//     }

//     if (!form.profileImage) {
//       Alert.alert("Validation Error", "Please upload a profile image");
//       return;
//     }

//     if (!form.currentRole) {
//       Alert.alert("Validation Error", "Please select a role");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Create FormData to send file and other data to backend
//       const formData = new FormData();
      
//       // Map form fields to backend schema
//       formData.append('name', `${form.firstName} ${form.lastName}`);
//       formData.append('dateOfBirth', form.dateOfBirth);
//       formData.append('region', form.region);
//       if (form.yearsOfService) {
//         formData.append('yearsOfService', form.yearsOfService);
//       }
      
//       // Find the selected party and role objects to get their IDs
//       const selectedParty = parties.find(p => p.abbreviation === form.party);
//       const selectedRole = roles.find(r => r.title === form.currentRole);
      
//       if (selectedParty) {
//         formData.append('party', selectedParty._id);
//       }
//       if (selectedRole) {
//         formData.append('currentRole', selectedRole._id);
//       }
      
//       // Add achievements if provided
//       if (form.achievements.trim()) {
//         // Split achievements by comma and send as array
//         const achievementsArray = form.achievements.split(',').map(a => a.trim()).filter(a => a);
//         formData.append('achievements', JSON.stringify(achievementsArray));
//       }

//       // Add the profile image file
//       const uriParts = form.profileImage.split('.');
//       const fileType = uriParts[uriParts.length - 1];
      
//       // For web, we need to fetch the blob first
//       const response = await fetch(form.profileImage);
//       const blob = await response.blob();
      
//       // Create a file from the blob
//       const file = new File([blob], `politician-profile-${Date.now()}.${fileType}`, {
//         type: `image/${fileType}`,
//       });
      
//       // Use 'image' field name to match backend schema
//       formData.append('image', file);

//       // Send to backend - backend will handle Cloudinary upload
//       const uploadResponse = await fetch(`${API_BASE_URL}/api/politicians`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!uploadResponse.ok) {
//         const error = await uploadResponse.json();
//         throw new Error(error.message || "Error creating politician");
//       }

//       const result = await uploadResponse.json();
//       console.log("Politician created:", result);
      
//       // Reset form
//       setForm({
//         firstName: "",
//         lastName: "",
//         party: "",
//         currentRole: "",
//         region: "",
//         profileImage: "",
//         dateOfBirth: "",
//         yearsOfService: "",
//         achievements: ""
//       });
      
//       // Show success message with OK button, then navigate back
//       Alert.alert(
//         "Success", 
//         "Politician added successfully!",
//         [
//           {
//             text: "OK",
//             onPress: () => navigation.goBack()
//           }
//         ]
//       );

//     } catch (error) {
//       console.error("Error:", error);
      
//       // Fallback for development mode
//       if (backendStatus !== 'connected' && __DEV__) {
//         console.log("Development mode: Backend not available. Politician data:");
//         console.log(form);
//         Alert.alert(
//           "Development Mode", 
//           "Backend not available. Politician data logged to console.",
//           [
//             {
//               text: "OK",
//               onPress: () => navigation.goBack()
//             }
//           ]
//         );
//       } else {
//         const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
//         Alert.alert("Error", errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add New Politician</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Backend Status Indicator */}
//       {backendStatus === 'checking' && (
//         <View style={[styles.statusBanner, styles.statusChecking]}>
//           <Ionicons name="sync" size={16} color="#666" />
//           <Text style={styles.statusText}>Checking backend connection...</Text>
//         </View>
//       )}
//       {backendStatus === 'connected' && (
//         <View style={[styles.statusBanner, styles.statusConnected]}>
//           <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
//           <Text style={styles.statusText}>Backend connected</Text>
//         </View>
//       )}
//       {backendStatus === 'disconnected' && (
//         <View style={[styles.statusBanner, styles.statusDisconnected]}>
//           <Ionicons name="warning" size={16} color="#f59e0b" />
//           <Text style={styles.statusText}>Using offline mode</Text>
//         </View>
//       )}

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
          
//           {/* Profile Image Upload */}
//           <Text style={styles.label}>Profile Image *</Text>
//           <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
//             {form.profileImage ? (
//               <View style={styles.imagePreview}>
//                 <Image source={{ uri: form.profileImage }} style={styles.previewImage} />
//                 <Text style={styles.changeImageText}>Tap to change image</Text>
//               </View>
//             ) : (
//               <View style={styles.uploadPlaceholder}>
//                 <Ionicons name="camera-outline" size={40} color="#ccc" />
//                 <Text style={styles.uploadText}>Tap to upload profile image</Text>
//               </View>
//             )}
//           </TouchableOpacity>
          
//           <Text style={styles.label}>First Name *</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter first name"
//             value={form.firstName}
//             onChangeText={(val) => handleChange("firstName", val)}
//           />

//           <Text style={styles.label}>Last Name *</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter last name"
//             value={form.lastName}
//             onChangeText={(val) => handleChange("lastName", val)}
//           />

//           <Text style={styles.label}>Date of Birth</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="YYYY-MM-DD (e.g., 1975-06-15)"
//             value={form.dateOfBirth}
//             onChangeText={(val) => handleChange("dateOfBirth", val)}
//           />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Political Information</Text>
          
//           <Text style={styles.label}>Party *</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={form.party}
//               onValueChange={(val: string) => handleChange("party", val)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Select a party" value="" />
//               {parties.map(party => (
//                 <Picker.Item 
//                   key={party._id} 
//                   label={`${party.fullName} (${party.abbreviation})`} 
//                   value={party.abbreviation} 
//                 />
//               ))}
//             </Picker>
//           </View>

//           <Text style={styles.label}>Role *</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={form.currentRole}
//               onValueChange={(val: string) => handleChange("currentRole", val)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Select a role" value="" />
//               {roles.map(role => (
//                 <Picker.Item 
//                   key={role._id} 
//                   label={`${role.title} (${role.level})`} 
//                   value={role.title} 
//                 />
//               ))}
//             </Picker>
//           </View>

//           <Text style={styles.label}>Region/Constituency</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., Colombo District, Kandy"
//             value={form.region}
//             onChangeText={(val) => handleChange("region", val)}
//           />

//           <Text style={styles.label}>Years of Service</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., 5"
//             value={form.yearsOfService}
//             onChangeText={(val) => handleChange("yearsOfService", val)}
//             keyboardType="numeric"
//           />

//           <Text style={styles.label}>Achievements</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Enter achievements separated by commas (e.g., Passed Education Reform Bill, Reduced Unemployment Rate)"
//             value={form.achievements}
//             onChangeText={(val) => handleChange("achievements", val)}
//             multiline
//             numberOfLines={4}
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.btn, loading && styles.btnDisabled]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <Ionicons name="sync" size={20} color="white" style={styles.buttonIcon} />
//           ) : (
//             <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
//           )}
//           <Text style={styles.buttonText}>
//             {loading ? "Adding Politician..." : "Add Politician"}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#f8f9fa" 
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e1e5e9",
//     elevation: 2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   placeholder: {
//     width: 40,
//   },
//   statusBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   statusChecking: {
//     backgroundColor: '#f3f4f6',
//   },
//   statusConnected: {
//     backgroundColor: '#dcfce7',
//   },
//   statusDisconnected: {
//     backgroundColor: '#fef3c7',
//   },
//   statusText: {
//     marginLeft: 8,
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 1,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//     paddingBottom: 8,
//   },
//   label: { 
//     marginTop: 12, 
//     marginBottom: 8,
//     fontWeight: "bold", 
//     fontSize: 14,
//     color: '#333'
//   },
//   input: { 
//     borderWidth: 1, 
//     borderColor: "#ddd", 
//     padding: 12, 
//     borderRadius: 8, 
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   imageUploadContainer: {
//     borderWidth: 2,
//     borderColor: '#ddd',
//     borderStyle: 'dashed',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fafafa',
//     marginBottom: 16,
//   },
//   imagePreview: {
//     alignItems: 'center',
//   },
//   previewImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 8,
//   },
//   changeImageText: {
//     color: '#666',
//     fontSize: 12,
//   },
//   uploadPlaceholder: {
//     alignItems: 'center',
//   },
//   uploadText: {
//     color: '#999',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//   },
//   btn: { 
//     marginTop: 16,
//     marginBottom: 32,
//     backgroundColor: "#3498db", 
//     padding: 16, 
//     borderRadius: 8, 
//     alignItems: "center",
//     flexDirection: 'row',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   btnDisabled: {
//     backgroundColor: "#95a5a6",
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
//   buttonText: {
//     color: "white", 
//     fontWeight: "bold",
//     fontSize: 16,
//   }
// });

// export default AddPoliticianForm;
