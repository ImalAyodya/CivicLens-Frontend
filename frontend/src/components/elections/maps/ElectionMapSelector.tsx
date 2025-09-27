import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface ElectionMapSelectorProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

const ElectionMapSelector: React.FC<ElectionMapSelectorProps> = ({
  years,
  selectedYear,
  onSelectYear
}) => {
  return (
    <View className="bg-white py-2">
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {years.map(year => (
          <TouchableOpacity
            key={year}
            onPress={() => onSelectYear(year)}
            style={[
              styles.yearButton,
              selectedYear === year ? styles.selectedButton : styles.unselectedButton
            ]}
          >
            <Text
              style={[
                styles.yearText,
                selectedYear === year ? styles.selectedText : styles.unselectedText
              ]}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  yearButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    height: 36,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#2563EB',
  },
  unselectedButton: {
    backgroundColor: '#F3F4F6',
  },
  yearText: {
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: '#1F2937',
  },
});

export default ElectionMapSelector;