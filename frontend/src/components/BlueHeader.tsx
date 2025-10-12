import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BlueHeaderProps {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
}

const BlueHeader: React.FC<BlueHeaderProps> = ({ title, onBack, rightIcon }) => {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#2563EB' }}>
      <View className="bg-blue-600 py-4 px-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {onBack && (
            <TouchableOpacity onPress={onBack} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-white text-lg font-semibold">{title}</Text>
        </View>
        
        {rightIcon && rightIcon}
      </View>
    </SafeAreaView>
  );
};

export default BlueHeader;