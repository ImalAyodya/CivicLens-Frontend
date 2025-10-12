import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface StepByStepGuideProps {
  title: string;
  steps: Step[];
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ title, steps }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-bold text-gray-800 mb-4">{title}</Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {steps.map((step, index) => (
          <Animated.View
            key={step.id}
            entering={FadeInRight.delay(index * 100).duration(400)}
            className="bg-blue-50 rounded-lg p-4 mr-4 w-64"
          >
            <View className="flex-row items-center mb-2">
              <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Ionicons name={step.icon as any} size={18} color="#1D4ED8" />
              </View>
              <Text className="text-blue-800 font-medium">{`Step ${index + 1}: ${step.title}`}</Text>
            </View>
            <Text className="text-gray-700 text-sm">{step.description}</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StepByStepGuide;