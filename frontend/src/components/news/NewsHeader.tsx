import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NewsHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ title, onSeeAllPress }) => {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-lg font-bold text-gray-800">{title}</Text>
      {onSeeAllPress && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text className="text-blue-600">See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewsHeader;