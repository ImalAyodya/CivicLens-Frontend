import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import PoliticianCard from "../../components/adminPanel/PoliticianCard";
import { Politician } from "../../types/Politician";

const API_BASE_URL = "http://localhost:5000";

const PoliticianListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [search, setSearch] = useState<string>("");
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [activeFilter, setActiveFilter] = useState("All");

  // Load politicians on component mount
  useEffect(() => {
    fetchPoliticians();
  }, []);

  // Filter politicians when search or politicians data changes
  useEffect(() => {
    filterPoliticians();
  }, [search, politicians, activeFilter]);

  const fetchPoliticians = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/politicians`);
      const politiciansData = response.data || [];
      
      // Transform backend data to match frontend types
      const transformedPoliticians = politiciansData.map((politician: any) => ({
        id: politician._id,
        name: politician.name,
        image: politician.image || 'https://via.placeholder.com/100x100/cccccc/666666?text=No+Image',
        currentRole: { title: politician.currentRole?.title || 'N/A' },
        party: { fullName: politician.party?.fullName || 'Independent' },
        region: politician.region || 'N/A',
        status: 'Active' as const, // Default status
        dateOfBirth: politician.dateOfBirth,
        yearsOfService: politician.yearsOfService,
        achievements: politician.achievements || []
      }));
      
      setPoliticians(transformedPoliticians);
      setBackendStatus('connected');
    } catch (error) {
      console.error('Error fetching politicians:', error);
      setBackendStatus('disconnected');
      
      if (__DEV__) {
        // Load dummy data in development mode
        const dummyPoliticians = [
          {
            id: "1",
            name: "John Mitchell",
            image: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=JM",
            currentRole: { title: "Mayor" },
            party: { fullName: "Democratic Party" },
            region: "California, District 12",
            status: "Active" as const,
          },
          {
            id: "2",
            name: "Sarah Johnson",
            image: "https://via.placeholder.com/100x100/DC2626/FFFFFF?text=SJ",
            currentRole: { title: "Senator" },
            party: { fullName: "Republican Party" },
            region: "Texas, District 8",
            status: "Active" as const,
          },
        ];
        setPoliticians(dummyPoliticians);
        console.log('Using dummy data - backend not available');
      } else {
        Alert.alert('Error', 'Failed to load politicians. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPoliticians = () => {
    let filtered = politicians;

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(politician =>
        politician.name.toLowerCase().includes(search.toLowerCase()) ||
        politician.party.fullName.toLowerCase().includes(search.toLowerCase()) ||
        politician.region.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== "All") {
      switch (activeFilter) {
        case "Active":
          filtered = filtered.filter(p => p.status === "Active");
          break;
        case "By Party":
          // Sort by party name
          filtered = [...filtered].sort((a, b) => a.party.fullName.localeCompare(b.party.fullName));
          break;
        case "By Region":
          // Sort by region
          filtered = [...filtered].sort((a, b) => a.region.localeCompare(b.region));
          break;
      }
    }

    setFilteredPoliticians(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPoliticians();
  };

  const handleDelete = async (politicianId: string) => {
    Alert.alert(
      "Delete Politician",
      "Are you sure you want to delete this politician?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/api/politicians/${politicianId}`);
              // Remove from local state
              setPoliticians(prev => prev.filter(p => p.id !== politicianId));
              Alert.alert("Success", "Politician deleted successfully");
            } catch (error) {
              console.error('Error deleting politician:', error);
              Alert.alert("Error", "Failed to delete politician");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Politician Management</Text>
        <View className="w-10" />
      </View>

      {/* Backend Status Indicator */}
      {/* {backendStatus === 'checking' && (
        <View className="flex-row items-center justify-center py-2 px-4 bg-gray-100">
          <Ionicons name="sync" size={16} color="#666" />
          <Text className="ml-2 text-sm text-gray-600">Checking backend connection...</Text>
        </View>
      )}
      {backendStatus === 'connected' && (
        <View className="flex-row items-center justify-center py-2 px-4 bg-green-100">
          <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
          <Text className="ml-2 text-sm text-green-700">Backend connected ({politicians.length} politicians)</Text>
        </View>
      )}
      {backendStatus === 'disconnected' && (
        <View className="flex-row items-center justify-center py-2 px-4 bg-yellow-100">
          <Ionicons name="warning" size={16} color="#f59e0b" />
          <Text className="ml-2 text-sm text-yellow-700">Using offline mode</Text>
        </View>
      )} */}

      <View className="flex-1 p-4">
        {/* Search */}
        <TextInput
          placeholder="Search politicians..."
          value={search}
          onChangeText={setSearch}
          className="bg-white rounded-xl px-4 py-3 mb-3 shadow-sm"
        />

        {/* Filters */}
        <View className="flex-row justify-around mb-3">
          {["All", "Active", "By Party", "By Region"].map((filter) => (
            <TouchableOpacity 
              key={filter} 
              className={`px-3 py-1 rounded-lg ${activeFilter === filter ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setActiveFilter(filter)}
            >
              <Text className={`text-sm ${activeFilter === filter ? 'text-white' : 'text-gray-700'}`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-xl flex-row justify-center items-center mb-3"
        onPress={() => navigation.navigate("AddPoliticianForm")}
      >
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Add New Politician</Text>
      </TouchableOpacity>

        {/* Statistics */}
        <View className="flex-row justify-between mb-3 bg-white rounded-xl p-4 shadow-sm">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">{filteredPoliticians.length}</Text>
            <Text className="text-sm text-gray-600">Total</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {filteredPoliticians.filter(p => p.status === 'Active').length}
            </Text>
            <Text className="text-sm text-gray-600">Active</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-600">
              {new Set(filteredPoliticians.map(p => p.party.fullName)).size}
            </Text>
            <Text className="text-sm text-gray-600">Parties</Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredPoliticians}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoliticianCard
              politician={item}
              onEdit={() => console.log("Edit", item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3498db']}
              tintColor={'#3498db'}
            />
          }
          ListEmptyComponent={
            <View className="items-center py-8">
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text className="text-gray-500 mt-2">
                {loading ? 'Loading politicians...' : 
                 search ? 'No politicians found matching your search' : 'No politicians available'}
              </Text>
              {!loading && !search && (
                <TouchableOpacity
                  className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
                  onPress={() => navigation.navigate("AddPoliticianForm")}
                >
                  <Text className="text-white font-semibold">Add First Politician</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
};

export default PoliticianListScreen;
