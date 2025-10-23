import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput as RNTextInput, Alert, ActivityIndicator } from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BlueHeader from "../../components/BlueHeader";
import type { RootStackParamList } from "../../navigation/types";

// Use a local top-level API_URL constant (HTTPS) so this screen doesn't rely on external Config
// Change to your local backend for development if needed: 'http://localhost:5000/api'
const API_URL = "https://civiclens-backend-production-2c6d.up.railway.app/api";
//const API_URL = "http://localhost:5000/api";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Party {
  _id: string;
  fullName: string;
  abbreviation: string;
  logo?: string;
  color?: string;
}

interface Role {
  _id: string;
  title: string;
  level: string;
  startDate: string;
  endDate: string | null;
  region?: string;
}

interface Politician {
  _id: string;
  name: string;
  party: Party;              // Party is an object, not a string
  image?: string;
  currentRole?: Role;
  dateOfBirth?: string;
  region?: string;
  yearsOfService?: number;
  achievements?: string[];
}

export default function AddElectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [electionName, setElectionName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPoliticians();
  }, []);

  const fetchPoliticians = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching politicians from:', `${API_URL}/politicians`);

      const response = await fetch(`${API_URL}/politicians`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Received data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      if (response.ok) {
        // Ensure data is an array
        if (Array.isArray(data)) {
          console.log('Number of politicians:', data.length);
          setPoliticians(data);
          if (data.length === 0) {
            setError("No politicians found in the system");
          }
        } else {
          console.error('Data is not an array:', data);
          setError("Invalid data format received from server");
        }
      } else {
        console.error('API Error:', data);
        setError(data.message || "Failed to fetch politicians");
      }
    } catch (error) {
      console.error("Error fetching politicians:", error);
      setError("Could not connect to server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleCreateElection = async () => {
    if (!electionName.trim()) {
      Alert.alert("Error", "Please enter an election name");
      return;
    }
    
    if (selectedCandidates.length < 2) {
      Alert.alert("Error", "Please select at least 2 candidates");
      return;
    }

    try {
      setCreating(true);
      
      // Prepare candidates array - backend expects array of politician ObjectIds
      const candidatesData = selectedCandidates.map((politicianId) => ({
        politician: politicianId,  // Send politician ObjectId reference
        votes: 0                   // Initialize with 0 votes
      }));

      // Match backend schema: title (not name), candidates with politician references
      const electionData = {
        title: electionName,                    // Backend uses 'title' not 'name'
        description: description || undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        candidates: candidatesData,             // Array of { politician: ObjectId, votes: 0 }
      };

      console.log('Creating election with data:', JSON.stringify(electionData, null, 2));

      const response = await fetch(`${API_URL}/virtualElections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(electionData),
      });      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Election created successfully!", [
          { 
            text: "OK", 
            onPress: () => navigation.goBack() 
          }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create election");
      }
    } catch (error) {
      console.error("Error creating election:", error);
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <BlueHeader title="Add Election" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading politicians...</Text>
        </View>
      </View>
    );
  }

  if (politicians.length === 0) {
    return (
      <View style={styles.container}>
        <BlueHeader title="Add Election" onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {error || "No Politicians Available"}
          </Text>
          <Text style={styles.emptySubtext}>
            {error 
              ? "There was an error loading the politicians. Please try again."
              : "Please add politicians to the system before creating an election."
            }
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={fetchPoliticians}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BlueHeader title="Add Election" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        {/* Election Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Election Name *</Text>
          <RNTextInput
            placeholder="e.g., Presidential Election 2025"
            value={electionName}
            onChangeText={setElectionName}
            style={styles.input}
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <RNTextInput
            placeholder="Add election notes or description..."
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Start Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start Date & Time *</Text>
          <View style={[styles.input, styles.dateInput]}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>
        </View>

        {/* End Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date & Time *</Text>
          <View style={[styles.input, styles.dateInput]}>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </View>

        {/* Candidates */}
        <Text style={styles.sectionTitle}>Select Candidates * ({politicians.length} available)</Text>
        {politicians.length > 0 ? (
          politicians.map((politician) => {
            if (!politician || !politician._id) {
              console.warn('Invalid politician data:', politician);
              return null;
            }
            
            return (
              <TouchableOpacity
                key={politician._id}
                style={styles.candidateCard}
                onPress={() => toggleCandidate(politician._id)}
              >
                <View style={styles.row}>
                  <Checkbox
                    status={selectedCandidates.includes(politician._id) ? "checked" : "unchecked"}
                    onPress={() => toggleCandidate(politician._id)}
                  />
                  <Image 
                    source={{ 
                      uri: politician.image || "https://randomuser.me/api/portraits/men/32.jpg" 
                    }} 
                    style={styles.avatar} 
                  />
                  <View style={styles.candidateInfo}>
                    <Text style={styles.candidateName}>{politician.name || 'Unknown'}</Text>
                    <Text style={styles.party}>
                      {politician.party?.abbreviation || politician.party?.fullName || 'No Party'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noCandidatesContainer}>
            <Text style={styles.noCandidatesText}>No politicians available</Text>
          </View>
        )}

        {/* Create Election Button */}
        <TouchableOpacity
          style={[styles.createBtn, creating && styles.createBtnDisabled]}
          onPress={handleCreateElection}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createBtnText}>Create Election</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#374151",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 8,
  },
  candidateCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  party: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  noCandidatesContainer: {
    padding: 24,
    alignItems: "center",
  },
  noCandidatesText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  createBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  createBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
