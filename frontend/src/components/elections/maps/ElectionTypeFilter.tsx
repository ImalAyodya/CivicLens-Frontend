import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ElectionTypeFilterProps {
  types: string[];
  selectedType: string;
  onSelectType: (type: string) => void;
}

const ElectionTypeFilter: React.FC<ElectionTypeFilterProps> = ({
  types,
  selectedType,
  onSelectType
}) => {
  return (
    <View className="flex-row bg-white px-4 pt-1 pb-3">
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onSelectType(type)}
          className={`rounded-full py-1 px-3 mr-2 ${
            selectedType === type
              ? 'bg-blue-600'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              selectedType === type ? 'text-white' : 'text-gray-700'
            }`}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ElectionTypeFilter;