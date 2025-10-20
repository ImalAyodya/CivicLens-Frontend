import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface LawAccordionProps {
  title: string;
  content: string;
  referenceNumber?: string;
}

const LawAccordion: React.FC<LawAccordionProps> = ({
  title,
  content,
  referenceNumber
}) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View className="bg-white rounded-lg overflow-hidden mb-3 shadow-sm">
      <TouchableOpacity
        className="p-4 flex-row items-center justify-between"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text className="font-bold text-gray-800">{title}</Text>
          {referenceNumber && (
            <Text className="text-xs text-gray-500">{referenceNumber}</Text>
          )}
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#4B5563"
        />
      </TouchableOpacity>
      
      {expanded && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          className="px-4 pb-4 border-t border-gray-100"
        >
          <Text className="text-gray-700 mt-2">{content}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default LawAccordion;