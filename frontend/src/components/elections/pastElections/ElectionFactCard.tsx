import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ElectionFactCardProps {
  fact: string;
  onShare?: () => void;
}

const ElectionFactCard: React.FC<ElectionFactCardProps> = ({ fact, onShare }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 flex-row items-center">
      <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
        <Ionicons name="information" size={20} color="#1D4ED8" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-700 font-medium">Did You Know?</Text>
        <Text className="text-gray-600 text-sm mt-1">{fact}</Text>
      </View>
      {onShare && (
        <TouchableOpacity 
          onPress={onShare} 
          className="ml-2"
        >
          <Ionicons name="share-social-outline" size={22} color="#3B82F6" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ElectionFactCard;