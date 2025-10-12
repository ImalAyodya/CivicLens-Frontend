import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'Comparison'>;

// Mock politician data
const allPoliticians = [
  {
    id: '1',
    name: 'Ranil Wickremesinghe',
    position: 'President',
    party: 'United National Party',
    image: '🧑‍💼',
  },
  {
    id: '2',
    name: 'Mahinda Rajapaksa',
    position: 'Former President',
    party: 'Sri Lanka Podujana Peramuna',
    image: '🧑‍💼',
  },
  {
    id: '3',
    name: 'Sajith Premadasa',
    position: 'Leader of the Opposition',
    party: 'Samagi Jana Balawegaya',
    image: '🧑‍💼',
  },
  {
    id: '4',
    name: 'Dinesh Gunawardena',
    position: 'Prime Minister',
    party: 'Sri Lanka Podujana Peramuna',
    image: '🧑‍💼',
  },
  {
    id: '5',
    name: 'Anura Kumara Dissanayake',
    position: 'MP',
    party: 'Janatha Vimukthi Peramuna',
    image: '🧑‍💼',
  },
  {
    id: '6',
    name: 'Chamal Rajapaksa',
    position: 'Minister',
    party: 'Sri Lanka Podujana Peramuna',
    image: '🧑‍💼',
  },
];

const ComparisonScreen: React.FC<Props> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedPoliticians, setSelectedPoliticians] = useState<typeof allPoliticians>([]);

  const handleSelectPolitician = (politician: typeof allPoliticians[0]) => {
    if (selectedPoliticians.length < 2) {
      setSelectedPoliticians([...selectedPoliticians, politician]);
    }
  };

  const handleRemovePolitician = (politician: typeof allPoliticians[0]) => {
    setSelectedPoliticians(selectedPoliticians.filter(p => p.id !== politician.id));
  };

  const handleNext = () => {
    console.log('Compare politicians:', selectedPoliticians);
    // Navigate to the comparison result screen with the selected politicians
    navigation.navigate('ComparisonResult', {
      politician1: selectedPoliticians[0],
      politician2: selectedPoliticians[1]
    });
  };

  // Filter politicians based on search text
  const filteredPoliticians = allPoliticians.filter(politician => 
    politician.name.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedPoliticians.some(p => p.id === politician.id)
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white shadow-sm p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Compare Politicians</Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Text className="text-gray-500 mr-2">🔍</Text>
          <TextInput
            placeholder="Search for a politician..."
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1"
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
                <Text className="text-blue-800 mr-1">{politician.image}</Text>
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
      <View className="px-4 py-2">
        <Text className="text-sm font-medium text-gray-600 mb-2">
          Search Results
        </Text>
        
        <FlatList
          data={filteredPoliticians}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">{item.image}</Text>
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
            Next
          </Text>
          <Text className={`${
            selectedPoliticians.length === 2 ? 'text-white' : 'text-gray-500'
          } ml-1`}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComparisonScreen;