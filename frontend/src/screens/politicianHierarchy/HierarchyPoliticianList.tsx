import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from "axios";
import PoliticianCard from "../../components/adminPanel/PoliticianCard";
import BlueHeader from "../../components/BlueHeader";
import { Politician } from "../../types/Politician";
import type { RootStackParamList } from '../../navigation/types';

const API_BASE_URL = "https://civiclens-backend-production-2c6d.up.railway.app";

type HierarchyPoliticianListRouteProp = RouteProp<RootStackParamList, "HierarchyPoliticianList">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HierarchyPoliticianList: React.FC = () => {
  const route = useRoute<HierarchyPoliticianListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  // Get hierarchy level info from route params
  const levelId = route.params?.levelId;
  const levelName = route.params?.levelName || "Politicians";
  
  const [search, setSearch] = useState<string>("");
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [activeFilter, setActiveFilter] = useState("All");

  // Load politicians on component mount
  useEffect(() => {
    fetchPoliticiansByLevel();
  }, [levelId]);

  // Filter politicians when search or politicians data changes
  useEffect(() => {
    filterPoliticians();
  }, [search, politicians, activeFilter]);

  const fetchPoliticiansByLevel = async () => {
    setLoading(true);
    try {
      let endpoint = `${API_BASE_URL}/api/politicians`;
      
      // If levelId is provided, use the level-specific endpoint
      if (levelId) {
        endpoint = `${API_BASE_URL}/api/politicians/level/${levelId}`;
      }
      
      console.log("Fetching politicians from:", endpoint);
      const response = await axios.get(endpoint);
      const politiciansData = response.data || [];
      
      // Transform backend data to match frontend types
      const transformedPoliticians = politiciansData.map((politician: any) => ({
        id: politician._id,
        name: politician.name,
        image: politician.image || 'https://via.placeholder.com/100x100/cccccc/666666?text=No+Image',
        currentRole: { title: politician.currentRole?.title || politician.level?.name || 'N/A' },
        party: { fullName: politician.party?.fullName || politician.party || 'Independent' },
        region: politician.region || 'N/A',
        status: 'Active' as const, // Default status
        dateOfBirth: politician.dateOfBirth,
        yearsOfService: politician.yearsOfService,
        achievements: politician.achievements || [],
        level: politician.level
      }));
      
      setPoliticians(transformedPoliticians);
      setBackendStatus('connected');
      
      console.log(`Loaded ${transformedPoliticians.length} politicians for level: ${levelName}`);
    } catch (error) {
      console.error('Error fetching politicians by level:', error);
      setBackendStatus('disconnected');
      
      if (__DEV__) {
        // Load dummy data in development mode based on level
        const dummyPoliticians = getDummyPoliticiansByLevel(levelName);
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

  const getDummyPoliticiansByLevel = (levelName: string): Politician[] => {
    const basePoliticians = [
      {
        id: "1",
        name: "Ranil Wickremesinghe",
        image: "https://via.placeholder.com/100x100/0056FF/FFFFFF?text=RW",
        currentRole: { title: "President" },
        party: { fullName: "United National Party" },
        region: "Colombo District",
        status: "Active" as const,
      },
      {
        id: "2",
        name: "Dinesh Gunawardena",
        image: "https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=DG",
        currentRole: { title: "Prime Minister" },
        party: { fullName: "Podujana Peramuna" },
        region: "Colombo District",
        status: "Active" as const,
      },
      {
        id: "3",
        name: "Mahinda Rajapaksa",
        image: "https://via.placeholder.com/100x100/DC2626/FFFFFF?text=MR",
        currentRole: { title: "Member of Parliament" },
        party: { fullName: "Podujana Peramuna" },
        region: "Kurunegala District",
        status: "Active" as const,
      },
    ];

    // Filter dummy data based on level name
    switch (levelName.toLowerCase()) {
      case 'president':
        return basePoliticians.filter(p => p.currentRole.title === 'President');
      case 'prime minister':
        return basePoliticians.filter(p => p.currentRole.title === 'Prime Minister');
      case 'members of parliament':
      case 'cabinet ministers':
        return basePoliticians.filter(p => p.currentRole.title === 'Member of Parliament');
      default:
        return basePoliticians;
    }
  };

  const filterPoliticians = () => {
    let filtered = politicians;

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(politician =>
        politician.name.toLowerCase().includes(search.toLowerCase()) ||
        politician.party.fullName.toLowerCase().includes(search.toLowerCase()) ||
        politician.region.toLowerCase().includes(search.toLowerCase()) ||
        politician.currentRole.title.toLowerCase().includes(search.toLowerCase())
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
    fetchPoliticiansByLevel();
  };

  const handlePoliticianPress = (politician: Politician) => {
    // Navigate to politician profile
    navigation.navigate("PoliticianDetails", { id: politician.id });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BlueHeader title={`${levelName} - Political Hierarchy`} onBack={() => navigation.goBack()} />

      {/* Backend Status Indicator */}
      {/* {backendStatus === 'checking' && (
        <View className="flex-row items-center justify-center py-2 px-4 bg-gray-100">
          <ActivityIndicator size="small" color="#666" />
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
          placeholder={`Search ${levelName.toLowerCase()}...`}
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

        {/* Level Information Card */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-800">{levelName}</Text>
              <Text className="text-sm text-gray-500">Hierarchy Level</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">{filteredPoliticians.length}</Text>
              <Text className="text-sm text-gray-600">Total</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View className="flex-row justify-between mb-3 bg-white rounded-xl p-4 shadow-sm">
          <View className="items-center">
            <Text className="text-xl font-bold text-green-600">
              {filteredPoliticians.filter(p => p.status === 'Active').length}
            </Text>
            <Text className="text-sm text-gray-600">Active</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-purple-600">
              {new Set(filteredPoliticians.map(p => p.party.fullName)).size}
            </Text>
            <Text className="text-sm text-gray-600">Parties</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-orange-600">
              {new Set(filteredPoliticians.map(p => p.region)).size}
            </Text>
            <Text className="text-sm text-gray-600">Regions</Text>
          </View>
        </View>

        {/* Politicians List */}
        <FlatList
          data={filteredPoliticians}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoliticianCard
              politician={item}
              onEdit={() => console.log("Edit politician:", item.id)}
              onDelete={() => console.log("Delete politician:", item.id)}
              onPress={() => handlePoliticianPress(item)}
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
              <Text className="text-gray-500 mt-2 text-center">
                {loading ? `Loading ${levelName.toLowerCase()}...` : 
                 search ? `No ${levelName.toLowerCase()} found matching your search` : 
                 `No ${levelName.toLowerCase()} available at this level`}
              </Text>
              {!loading && !search && (
                <Text className="text-gray-400 mt-2 text-center text-sm">
                  This hierarchy level currently has no politicians assigned
                </Text>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default HierarchyPoliticianList;