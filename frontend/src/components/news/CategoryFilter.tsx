import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="py-3 px-4 border-b border-gray-200 bg-white"
    >
      {categories.map((category) => (
        <TouchableOpacity 
          key={category}
          onPress={() => onSelectCategory(category)}
          className={`px-4 py-1.5 mr-2 rounded-full ${
            activeCategory === category 
              ? 'bg-blue-600' 
              : 'bg-gray-100'
          }`}
        >
          <Text className={`${
            activeCategory === category
              ? 'text-white font-medium'
              : 'text-gray-700'
          }`}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;