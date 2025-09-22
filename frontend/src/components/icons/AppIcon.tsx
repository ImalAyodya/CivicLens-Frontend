import React from 'react';
import { View, Text } from 'react-native';

const AppIcon = () => (
  <View className="bg-white rounded-2xl w-16 h-16 items-center justify-center shadow-lg mb-4">
    <View className="bg-blue-600 rounded-lg w-10 h-10 items-center justify-center">
      <Text className="text-white text-lg font-bold">📊</Text>
    </View>
  </View>
);

export default AppIcon;