import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "EditElection">;
type EditElectionRouteProp = RouteProp<RootStackParamList, "EditElection">;

const API_BASE_URL = "http://localhost:5000";

// Election types
const ELECTION_TYPES = [
  "Presidential",
  "Parliamentary",
  "Provincial",
  "Local",
  "Referendum",
  "By-election"
];

// Election statuses
const ELECTION_STATUSES = [
  "Upcoming",
  "Ongoing",
  "Completed",
  "Postponed",
  "Cancelled"
];

const EditElectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditElectionRouteProp>();
  const { electionId } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    title: "",
    electionType: "Presidential",
    date: new Date(),
    description: "",
    isUpcoming: true,
    status: "Upcoming",
    voterTurnout: "",
  });

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/elections/${electionId}`);
        const electionData = response.data.data || response.data;
        
        setForm({
          title: electionData.title || "",
          electionType: electionData.electionType || "Presidential",
          date: new Date(electionData.date) || new Date(),
          description: electionData.description || "",
          isUpcoming: electionData.isUpcoming !== undefined ? electionData.isUpcoming : true,
          status: electionData.status || "Upcoming",
          voterTurnout: electionData.voterTurnout ? electionData.voterTurnout.toString() : "",
        });
      } catch (error) {
        console.error("Failed to fetch election details:", error);
        Alert.alert("Error", "Failed to load election details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchElectionDetails();
  }, [electionId]);

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "Title is required");
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert("Error", "Description is required");
      return false;
    }
    return true;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, date: selectedDate });
    }
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Convert voter turnout to number if provided
      const voterTurnout = form.voterTurnout.trim() 
        ? parseFloat(form.voterTurnout) 
        : null;

      // Adjust status based on isUpcoming
      const status = form.isUpcoming ? "Upcoming" : form.status;

      await axios.put(`${API_BASE_URL}/api/elections/${electionId}`, {
        title: form.title,
        electionType: form.electionType,
        date: form.date.toISOString(),
        description: form.description,
        isUpcoming: form.isUpcoming,
        status: status,
        voterTurnout: voterTurnout
      });

      Alert.alert(
        "Success",
        "Election updated successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Failed to update election:", error);
      Alert.alert("Error", "Failed to update election");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading election details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Election</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* Title */}
          <Text style={styles.label}>Election Title *</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder="Enter election title"
            placeholderTextColor="#94A3B8"
          />

          {/* Election Type */}
          <Text style={styles.label}>Election Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.electionType}
              onValueChange={(value) => setForm({ ...form, electionType: value })}
              style={styles.picker}
            >
              {ELECTION_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          {/* Election Date */}
          <Text style={styles.label}>Election Date *</Text>
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDisplayDate(form.date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder="Enter election description"
            placeholderTextColor="#94A3B8"
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Is Upcoming */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Upcoming Election</Text>
            <Switch
              trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
              thumbColor={form.isUpcoming ? "#2563EB" : "#f4f3f4"}
              ios_backgroundColor="#CBD5E1"
              onValueChange={() => setForm({ ...form, isUpcoming: !form.isUpcoming })}
              value={form.isUpcoming}
            />
          </View>

          {/* Status (only shown if not upcoming) */}
          {!form.isUpcoming && (
            <>
              <Text style={styles.label}>Election Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                  style={styles.picker}
                >
                  {ELECTION_STATUSES.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Voter Turnout (only shown if not upcoming) */}
          {!form.isUpcoming && (
            <>
              <Text style={styles.label}>Voter Turnout %</Text>
              <TextInput
                style={styles.input}
                value={form.voterTurnout}
                onChangeText={(text) => {
                  // Allow only numbers and decimal point
                  const newText = text.replace(/[^0-9.]/g, '');
                  setForm({ ...form, voterTurnout: newText });
                }}
                placeholder="Enter voter turnout percentage"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={loading ? "Updating election, please wait" : "Update election"}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save-outline" size={20} color="white" style={styles.buttonIcon} />
            )}
            <Text style={styles.buttonText}>
              {loading ? "Updating Election..." : "Update Election"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 16,
    color: "#334155"
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1E293B"
  },
  textArea: {
    height: 120,
    textAlignVertical: "top"
  },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 8
  },
  picker: {
    height: 50
  },
  datePickerButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  dateText: {
    fontSize: 16,
    color: "#1E293B"
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9"
  },
  switchLabel: {
    fontSize: 16,
    color: "#334155"
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 24
  },
  btnDisabled: {
    backgroundColor: "#93C5FD"
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default EditElectionScreen;