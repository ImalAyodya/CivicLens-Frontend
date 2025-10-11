import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ElectionFactType } from '../../types/election';

interface ElectionFactProps {
  fact: ElectionFactType;
  onPress?: () => void;
}

const ElectionFact: React.FC<ElectionFactProps> = ({ fact, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm p-4 mb-3"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="flex-row justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="information-circle" size={18} color="#3B82F6" />
          <Text className="text-base font-medium text-gray-900 ml-2">{fact.title}</Text>
        </View>
        {fact.verified && (
          <View className="flex-row items-center bg-green-100 px-2 py-0.5 rounded">
            <Ionicons name="checkmark-circle" size={14} color="#059669" />
            <Text className="text-xs text-green-700 ml-1">Verified</Text>
          </View>
        )}
      </View>
      
      <Text className="text-gray-700 mb-2">{fact.content}</Text>
      
      {(fact.source || fact.category) && (
        <View className="flex-row justify-between mt-2">
          {fact.category && (
            <View className="bg-blue-50 px-2 py-1 rounded">
              <Text className="text-xs text-blue-700">{fact.category}</Text>
            </View>
          )}
          {fact.source && (
            <Text className="text-xs text-gray-500">Source: {fact.source}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ElectionFact;