import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ElectionFactProps {
  fact: string;
  onShare?: () => void;
}

const ElectionFact: React.FC<ElectionFactProps> = ({ fact, onShare }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
          <Ionicons name="information" size={18} color="#1D4ED8" />
        </View>
        <Text className="font-bold text-gray-700">Election Fact of the Day</Text>
      </View>
      
      <Text className="text-gray-700 mb-2">{fact}</Text>
      
      <TouchableOpacity 
        onPress={onShare} 
        className="flex-row items-center"
      >
        <Ionicons name="share-outline" size={16} color="#3B82F6" />
        <Text className="text-blue-500 ml-1 text-sm">Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ElectionFact;