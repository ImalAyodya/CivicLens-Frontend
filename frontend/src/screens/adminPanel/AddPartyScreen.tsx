import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Predefined color palette for political parties
const COLOR_PALETTE = [
  '#FF0000', '#DC143C', '#8B0000', '#CD5C5C', // Reds
  '#0000FF', '#4169E1', '#000080', '#1E90FF', // Blues
  '#008000', '#228B22', '#006400', '#32CD32', // Greens
  '#FFD700', '#FFA500', '#FF8C00', '#DAA520', // Yellows/Oranges
  '#800080', '#9370DB', '#8B008B', '#BA55D3', // Purples
  '#A52A2A', '#8B4513', '#D2691E', '#CD853F', // Browns
  '#FF1493', '#FF69B4', '#C71585', '#DB7093', // Pinks
  '#00CED1', '#20B2AA', '#008B8B', '#48D1CC', // Cyans
  '#808080', '#696969', '#2F4F4F', '#778899', // Grays
  '#000000', '#FFFFFF', '#FFE4B5', '#F5DEB3', // Others
];


const AddPartyScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    fullName: "",
    abbreviation: "",
    logo: "",
    color: "#007bff"
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

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
      setForm({ ...form, logo: result.assets[0].uri });
    }
  };

  const onColorChange = (color: string) => {
    setForm({ ...form, color });
  };

  // const handleSubmit = async () => {
  //   // Validate form data
  //   if (!form.fullName.trim() || !form.abbreviation.trim()) {
  //     alert("Please fill in at least the Party Name and Abbreviation fields");
  //     return;
  //   }

  //   try {
  //     // For development, simulate successful submission if backend is not available
  //     if (__DEV__) {
  //       console.log("Party data to submit:", form);
  //       alert("Party added successfully! (Development mode - no backend connection)");
  //       navigation.goBack();
  //       return;
  //     }

  //     const res = await fetch("http://localhost:5000/api/parties", {
  //       method: "POST",
  //       headers: { 
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify(form)
  //     });
      
  //     if (res.ok) {
  //       const result = await res.json();
  //       console.log("Party added:", result);
  //       alert("Party added successfully!");
  //       navigation.goBack();
  //     } else {
  //       const errorData = await res.text();
  //       console.error("Server error:", errorData);
  //       alert(`Error adding party: ${res.status} ${res.statusText}`);
  //     }
  //   } catch (err) {
  //     console.error("Network error:", err);
  //     // For development, show a more helpful error message
  //     if (__DEV__) {
  //       alert("Development mode: Backend server not available. Party data logged to console.");
  //       console.log("Would submit party data:", form);
  //       navigation.goBack();
  //     } else {
  //       alert("Network error: Unable to connect to server");
  //     }
  //   }
  // };
  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.abbreviation.trim()) {
      Alert.alert("Validation Error", "Please fill in at least the Party Name and Abbreviation fields");
      return;
    }

    if (!form.logo) {
      Alert.alert("Validation Error", "Please upload a party logo");
      return;
    }

    try {
      // Create FormData to send file and other data to backend
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('abbreviation', form.abbreviation);
      formData.append('color', form.color);

      // Add the logo file
      const uriParts = form.logo.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // For web, we need to fetch the blob first
      const response = await fetch(form.logo);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `party-logo-${Date.now()}.${fileType}`, {
        type: `image/${fileType}`,
      });
      
      formData.append('logo', file);

      // Send to backend - backend will handle Cloudinary upload
      const uploadResponse = await fetch("http://localhost:5000/api/parties", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || "Error creating party");
      }

      const result = await uploadResponse.json();
      console.log("Party created:", result);
      
      // Reset form
      setForm({
        fullName: "",
        abbreviation: "",
        logo: "",
        color: "#007bff"
      });
      
      // Show success message with OK button, then navigate back
      Alert.alert(
        "Success", 
        "Party added successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Party</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Party Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter full party name"
          value={form.fullName}
          onChangeText={v => handleChange("fullName", v)} 
        />

        <Text style={styles.label}>Abbreviation *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., UNP, SLPP"
          value={form.abbreviation}
          onChangeText={v => handleChange("abbreviation", v)} 
        />

        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Ionicons name="cloud-upload-outline" size={24} color="#007bff" />
          <Text style={styles.uploadButtonText}>
            {form.logo ? 'Change Logo' : 'Upload Logo'}
          </Text>
        </TouchableOpacity>
        {form.logo && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: form.logo }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setForm({ ...form, logo: "" })}
            >
              <Ionicons name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Party Color</Text>
        <TouchableOpacity 
          style={styles.colorSelectorButton}
          onPress={() => setShowColorPicker(true)}
        >
          <View style={[styles.colorPreview, { backgroundColor: form.color || '#ccc' }]} />
          <Text style={styles.colorValueText}>{form.color}</Text>
          <Ionicons name="color-palette-outline" size={24} color="#007bff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Ionicons name="add-circle" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add Party</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
        accessibilityViewIsModal={true}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Party Color</Text>
              <TouchableOpacity 
                onPress={() => setShowColorPicker(false)}
                accessibilityRole="button"
                accessibilityLabel="Close color picker"
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.colorPicker} showsVerticalScrollIndicator={false}>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      form.color === color && styles.selectedSwatch
                    ]}
                    onPress={() => onColorChange(color)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select color ${color}`}
                    accessibilityState={{ selected: form.color === color }}
                  >
                    {form.color === color && (
                      <Ionicons name="checkmark" size={24} color={color === '#000000' ? '#FFFFFF' : '#000000'} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.colorPreviewContainer}>
              <Text style={styles.colorPreviewLabel}>Selected Color:</Text>
              <View style={styles.selectedColorBox}>
                <View style={[styles.selectedColorSwatch, { backgroundColor: form.color }]} />
                <Text style={styles.selectedColorText}>{form.color.toUpperCase()}</Text>
              </View>
              
              <Text style={styles.customColorLabel}>Or enter custom color:</Text>
              <TextInput
                style={styles.customColorInput}
                placeholder="#007bff"
                value={form.color}
                onChangeText={(text) => {
                  // Validate hex color format
                  if (text.startsWith('#') && text.length <= 7) {
                    onColorChange(text);
                  } else if (!text.startsWith('#') && text.length <= 6) {
                    onColorChange('#' + text);
                  }
                }}
                maxLength={7}
              />
            </View>

            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowColorPicker(false)}
              accessibilityRole="button"
              accessibilityLabel="Confirm color selection"
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: '35%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  colorSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
  },
  colorValueText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  colorPicker: {
    maxHeight: 300,
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedSwatch: {
    borderColor: '#007bff',
    borderWidth: 3,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  colorPreviewContainer: {
    marginBottom: 20,
  },
  customColorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  customColorInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  colorPreviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  selectedColorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  selectedColorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
  },
  selectedColorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  }
});

export default AddPartyScreen;
