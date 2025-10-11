import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PoliticianCard from "../../components/politicianDirectory/PoliticianCard";
import SearchBar from "../../components/politicianDirectory/SearchBar";
import { politicians as dummyPoliticians } from "../../constants/dummyData";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import axios from "axios";
import type { Politician } from "../../types/Politician";

// Use the correct navigation type with access to the PoliticianProfile route
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_BASE_URL = "http://localhost:5000";

const DirectoryScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [politicians, setPoliticians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const navigation = useNavigation<NavigationProp>();

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
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

  // Fetch politicians from backend when backend status changes
  useEffect(() => {
    const fetchPoliticians = async () => {
      if (backendStatus === 'connected') {
        try {
          console.log("Fetching politicians from:", `${API_BASE_URL}/api/politicians`);
          const response = await axios.get(`${API_BASE_URL}/api/politicians`);
          console.log("Politicians response:", response.data);
          
          // Transform backend data to match frontend format
          const transformedPoliticians = response.data.map((politician: any) => ({
            id: politician._id,
            name: politician.name,
            party: politician.party?.fullName || politician.party || "Unknown Party",
            role: politician.currentRole?.title || politician.currentRole || "Unknown Role",
            image: politician.image || require("../../assets/images/politician1.jpeg"), // Default image
            partyColor: getPartyColor(politician.party?.fullName || politician.party),
          }));
          
          setPoliticians(transformedPoliticians);
        } catch (error) {
          console.log("Error fetching politicians:", error);
          // Fallback to dummy data if API fails
          setPoliticians(dummyPoliticians);
        }
      } else if (backendStatus === 'disconnected') {
        // Use dummy data when backend is disconnected
        setPoliticians(dummyPoliticians);
      }
      setLoading(false);
    };

    if (backendStatus !== 'checking') {
      fetchPoliticians();
    }
  }, [backendStatus]);

  // Helper function to get party colors
  const getPartyColor = (partyName: string) => {
    const partyColors: { [key: string]: string } = {
      "United National Party": "#16A34A",
      "Podu Jana Peramuna": "#DC2626", 
      "National People's Power": "#730b0bff",
      "Sri Lanka Freedom Party": "#2563EB",
      "Janatha Vimukthi Peramuna": "#7C2D12",
    };
    return partyColors[partyName] || "#6B7280"; // Default gray color
  };

  const filteredData = politicians.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.party.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Politicians Directory</Text>
      </View>
      
      
      {/* Backend Status Indicator */}
      {backendStatus === 'disconnected' && __DEV__ && (
        <View style={styles.statusBanner}>
          <Ionicons name="warning" size={16} color="#ff6b35" />
          <Text style={styles.statusText}>
            Backend disconnected - Using sample data
          </Text>
        </View>
      )}
      
      <SearchBar value={searchText} onChangeText={setSearchText} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading politicians...</Text>
        </View>
      ) : (
        <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PoliticianCard
            name={item.name}
            party={item.party}
            role={item.role}
            image={item.image}
            partyColor={item.partyColor}
            fullWidth={true}
            onPress={() => navigation.navigate("PoliticianProfile", { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default DirectoryScreen;