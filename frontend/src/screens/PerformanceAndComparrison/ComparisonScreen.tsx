import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPoliticiansForComparison } from '../../services/APIservices';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import BlueHeader from '../../components/BlueHeader'; // <-- Add this import

type Props = NativeStackScreenProps<RootStackParamList, 'Comparison'>;

// Define types
interface Politician {
  id: string;
  name: string;
  position: string;
  party: string;
  image: string;
  score?: number;
  totalPromises?: number;
  fulfilledPromises?: number;
}

// Add this helper function to handle image sources properly
const getImageSource = (imageUrl: string) => {
  // Check if URL is valid
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return { uri: imageUrl };
  }
  
  // If invalid URL or placeholder text, return default image
  return null;
};

const ComparisonScreen: React.FC<Props> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedPoliticians, setSelectedPoliticians] = useState<Politician[]>([]);
  const [allPoliticians, setAllPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch politicians from the backend
  useEffect(() => {
    const fetchPoliticians = async () => {
      try {
        setLoading(true);
        const data = await fetchPoliticiansForComparison();
        
        // Format the data to match our interface
        const formattedData: Politician[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          position: p.position || 'Unknown',
          party: p.party || 'Unknown',
          image: p.image || '🧑‍💼',
          score: p.score,
          totalPromises: p.totalPromises,
          fulfilledPromises: p.fulfilledPromises
        }));
        
        setAllPoliticians(formattedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch politicians:", err);
        setError("Failed to load politicians. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, []);

  const handleSelectPolitician = (politician: Politician) => {
    if (selectedPoliticians.length < 2) {
      setSelectedPoliticians([...selectedPoliticians, politician]);
    }
  };

  const handleRemovePolitician = (politician: Politician) => {
    setSelectedPoliticians(selectedPoliticians.filter(p => p.id !== politician.id));
  };

  const handleNext = () => {
    if (selectedPoliticians.length === 2) {
      navigation.navigate('ComparisonResult', {
        politician1: selectedPoliticians[0],
        politician2: selectedPoliticians[1]
      });
    }
  };

  // Filter politicians based on search text
  const filteredPoliticians = allPoliticians.filter(politician => 
    politician.name.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedPoliticians.some(p => p.id === politician.id)
  );

  return (
    <View className="flex-1 bg-white">
      {/* Blue header with back button and title */}
      <BlueHeader title="Compare Politicians" onBack={() => navigation.goBack()} />

      {/* Search Bar */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Text className="text-gray-500 mr-2">🔍</Text>
          <TextInput
            placeholder="Search for a politician..."
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-base text-gray-800"
            style={{ paddingVertical: 0 }}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      {/* Selected Politicians */}
      <View className="px-4 py-2 border-b border-gray-200">
        <Text className="text-sm font-medium text-gray-600 mb-2">
          Selected Politicians ({selectedPoliticians.length}/2)
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedPoliticians.length > 0 ? (
            selectedPoliticians.map(politician => (
              <View key={politician.id} className="bg-blue-50 rounded-full px-3 py-2 mr-2 flex-row items-center">
                {/* Replace text emoji with proper image */}
                <View className="h-6 w-6 rounded-full overflow-hidden mr-2">
                  {politician.image && politician.image.startsWith('http') ? (
                    <Image 
                      source={{ uri: politician.image }}
                      className="h-6 w-6"
                      style={{ resizeMode: 'cover' }}
                      onError={(e) => console.log('Error loading image')}
                    />
                  ) : (
                    <View className="h-6 w-6 bg-blue-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={12} color="#60a5fa" />
                    </View>
                  )}
                </View>
                <Text className="text-blue-800 mr-2">{politician.name}</Text>
                <TouchableOpacity onPress={() => handleRemovePolitician(politician)}>
                  <Text className="text-blue-800">×</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-400">No politicians selected yet</Text>
          )}
        </ScrollView>
      </View>

      {/* Search Results */}
      <View className="px-4 py-2 flex-1">
        <Text className="text-sm font-medium text-gray-600 mb-2">
          Search Results
        </Text>
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-2">Loading politicians...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity 
              className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
              onPress={() => setLoading(true)}
            >
              <Text className="text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPoliticians}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                  {/* Replace text emoji with proper image handling */}
                  <View className="h-12 w-12 rounded-full mr-3 overflow-hidden">
                    {item.image && item.image.startsWith('http') ? (
                      <Image 
                        source={{ uri: item.image }}
                        className="h-12 w-12"
                        style={{ resizeMode: 'cover' }}
                        onError={(e) => console.log('Error loading image')}
                      />
                    ) : (
                      <View className="h-12 w-12 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={24} color="#60a5fa" />
                      </View>
                    )}
                  </View>
                  <View>
                    <Text className="font-medium text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.position}</Text>
                    <Text className="text-gray-400 text-xs">{item.party}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className={`rounded-md px-3 py-1 ${
                    selectedPoliticians.length >= 2 ? 'bg-gray-200' : 'bg-blue-500'
                  }`}
                  onPress={() => handleSelectPolitician(item)}
                  disabled={selectedPoliticians.length >= 2}
                >
                  <Text 
                    className={
                      selectedPoliticians.length >= 2 
                        ? 'text-gray-500' 
                        : 'text-white'
                    }
                  >
                    + Add
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-gray-400 text-center py-4">
                No matching politicians found
              </Text>
            }
          />
        )}
      </View>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity 
            className={`rounded-md py-3 ${
              selectedPoliticians.length === 2 ? 'bg-blue-600' : 'bg-gray-300'
            } flex-row justify-center items-center`}
            onPress={handleNext}
            disabled={selectedPoliticians.length !== 2}
          >
            <Text className={`${
              selectedPoliticians.length === 2 ? 'text-white' : 'text-gray-500'
            } font-medium`}>
              Compare
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={selectedPoliticians.length === 2 ? "#fff" : "#6b7280"}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComparisonScreen;