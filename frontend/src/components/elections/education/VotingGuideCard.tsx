import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VotingGuideCardProps {
  title: string;
  description: string;
  imageSource: any;
  onPress: () => void;
}

const VotingGuideCard: React.FC<VotingGuideCardProps> = ({
  title,
  description,
  imageSource,
  onPress
}) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm"
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={imageSource}
        className="w-full h-40"
        resizeMode="cover"
      />
      
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-1">{title}</Text>
        <Text className="text-gray-600 mb-3 text-sm">{description}</Text>
        
        <View className="flex-row items-center justify-end">
          <Text className="text-blue-600 font-medium mr-1">Learn more</Text>
          <Ionicons name="arrow-forward" size={16} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VotingGuideCard;