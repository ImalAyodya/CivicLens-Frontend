import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HierarchyCard from "../../components/politicianHierarchy/HierarchyCard";
import type { RootStackParamList } from '../../navigation/types';
import axios from "axios";

type Level = {
  _id: string;
  name: string;
  description?: string;
  count?: number;
};

const API_BASE_URL = "http://localhost:5000";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HierarchyScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/api/levels`, { 
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

  // Fetch levels from backend when backend status changes
  useEffect(() => {
    const fetchLevels = async () => {
      if (backendStatus === 'connected') {
        try {
          console.log("Fetching levels from:", `${API_BASE_URL}/api/levels`);
          const response = await axios.get(`${API_BASE_URL}/api/levels`);
          console.log("Levels response:", response.data);
          
          // Optionally fetch politician count for each level
          const levelsWithCounts = await Promise.all(
            response.data.map(async (level: any) => {
              try {
                const politiciansResponse = await axios.get(`${API_BASE_URL}/api/politicians?level=${level._id}`);
                return {
                  ...level,
                  count: politiciansResponse.data.length
                };
              } catch (error) {
                return {
                  ...level,
                  count: 0
                };
              }
            })
          );
          
          setLevels(levelsWithCounts);
          console.log("Levels loaded from backend:", levelsWithCounts);
        } catch (error) {
          console.log("Error fetching levels:", error);
          // Fallback to hardcoded levels if API fails
          setLevels([
            { _id: '1', name: 'President', description: 'Head of State', count: 1 },
            { _id: '2', name: 'Prime Minister', description: 'Head of Government', count: 1 },
            { _id: '3', name: 'Cabinet Ministers', description: 'Cabinet Level', count: 24 },
            { _id: '4', name: 'Members of Parliament', description: 'Parliamentary Level', count: 225 },
            { _id: '5', name: 'Provincial Councils', description: 'Provincial Level', count: 9 },
            { _id: '6', name: 'Local Authorities', description: 'Local Level', count: 340 }
          ]);
        }
      } else if (backendStatus === 'disconnected') {
        // Use hardcoded levels when backend is disconnected
        setLevels([
          { _id: '1', name: 'President', description: 'Head of State', count: 1 },
          { _id: '2', name: 'Prime Minister', description: 'Head of Government', count: 1 },
          { _id: '3', name: 'Cabinet Ministers', description: 'Cabinet Level', count: 24 },
          { _id: '4', name: 'Members of Parliament', description: 'Parliamentary Level', count: 225 },
          { _id: '5', name: 'Provincial Councils', description: 'Provincial Level', count: 9 },
          { _id: '6', name: 'Local Authorities', description: 'Local Level', count: 340 }
        ]);
        console.log("Using fallback levels (backend disconnected)");
      }
      setLoading(false);
    };

    if (backendStatus !== 'checking') {
      fetchLevels();
    }
  }, [backendStatus]);

  // Helper function to get icon for each level
  const getLevelIcon = (levelName: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'President': 'star-outline',
      'Prime Minister': 'person-outline',
      'Cabinet Ministers': 'people-outline',
      'Members of Parliament': 'business-outline',
      'Provincial Councils': 'map-outline',
      'Local Authorities': 'home-outline',
    };
    return iconMap[levelName] || 'ellipse-outline';
  };

  // Helper function to get color for each level
  const getLevelColor = (levelName: string, index: number) => {
    const colorMap: { [key: string]: string } = {
      'President': '#0056FF',
      'Prime Minister': '#7C3AED',
      'Cabinet Ministers': '#059669',
      'Members of Parliament': '#DC2626',
      'Provincial Councils': '#EA580C',
      'Local Authorities': '#6366F1',
    };
    return colorMap[levelName] || `hsl(${index * 60}, 70%, 50%)`;
  };

  // Filter levels based on search text
  const filteredLevels = levels.filter(level =>
    level.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (level.description && level.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Handle level card press - navigate to politician list for that level
  const handleLevelPress = (level: Level) => {
    console.log("🟡 HIERARCHY: Level card pressed:", level.name, "ID:", level._id);
    
    try {
      console.log("🚀 Navigating to HierarchyPoliticianList for level:", level.name);
      navigation.navigate("HierarchyPoliticianList", {
        levelId: level._id,
        levelName: level.name
      });
      console.log("🟢 HIERARCHY: Navigation successful");
    } catch (error) {
      console.error("🔴 HIERARCHY: Navigation failed:", error);
      Alert.alert("Navigation Error", `Failed to navigate: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Political Hierarchy</Text>
        <Ionicons name="ellipsis-vertical" size={22} color="#555" />
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

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search levels..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {["All Levels", "By Party", "By Region", "Nation"].map((tab, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.filterChip, index === activeFilter && styles.activeFilter]}
            onPress={() => setActiveFilter(index)}
          >
            <Text style={[styles.filterText, index === activeFilter && styles.activeFilterText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {/* Hierarchy List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056FF" />
          <Text style={styles.loadingText}>Loading hierarchy levels...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredLevels.length > 0 ? (
            filteredLevels.map((level, index) => {
              console.log("🔵 RENDER: Rendering level card:", level.name, "ID:", level._id, "Index:", index);
              return (
                <TouchableOpacity 
                  key={level._id}
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("🟠 TOUCH: Level card pressed:", level.name, level._id);
                    handleLevelPress(level);
                  }}
                  style={styles.cardTouchable}
                >
                  <HierarchyCard
                    title={level.name}
                    name={level.count ? `${level.count} ${level.count === 1 ? 'Position' : 'Positions'}` : level.description || 'No description'}
                    icon={getLevelIcon(level.name)}
                    color={getLevelColor(level.name, index)}
                    highlight={index === 0}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No levels found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search terms</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {(["home", "git-network", "list", "person-circle"] as const).map((icon, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Ionicons name={icon} size={24} color={index === 1 ? "#0056FF" : "#aaa"} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HierarchyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  title: { 
    fontSize: 20, 
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  searchInput: { marginLeft: 8, flex: 1 },
  filterContainer: { 
    marginVertical: 15, 
    paddingHorizontal: 20,
    maxHeight: 40,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: "#f3f3f3",
    marginRight: 8,
    minWidth: 70,
  },
  filterText: { fontSize: 12, color: "#666", fontWeight: "500" },
  activeFilter: { backgroundColor: "#0056FF" },
  activeFilterText: { color: "#fff" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 80 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  cardTouchable: {
    marginBottom: 8,
  },


});
