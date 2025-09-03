import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LawCategoryCardProps {
  title: string;
  description: string;
  icon: string;
  count: number;
  onPress: () => void;
}

const LawCategoryCard: React.FC<LawCategoryCardProps> = ({
  title,
  description,
  icon,
  count,
  onPress
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 shadow-sm"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center mr-4">
          <Ionicons name={icon as any} size={24} color="#2563EB" />
        </View>
        
        <View className="flex-1">
          <Text className="font-bold text-gray-800">{title}</Text>
          <Text className="text-gray-600 text-sm">{description}</Text>
        </View>
        
        <View className="flex-row items-center">
          <View className="bg-gray-100 rounded-full px-2 py-1 mr-2">
            <Text className="text-xs text-gray-700">{count}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LawCategoryCard;