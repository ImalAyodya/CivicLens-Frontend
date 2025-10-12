import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdminTopBarProps {
  title: string;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ 
  title, 
  showMenuButton = false, 
  onMenuPress 
}) => {
  return (
    <View className="h-16 flex-row items-center px-4 bg-white border-b border-gray-200">
      {showMenuButton && (
        <TouchableOpacity 
          className="mr-3 w-9 h-9 rounded-full items-center justify-center"
          onPress={onMenuPress}
        >
          <Ionicons name="menu-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      )}
      
      <View className="flex-1">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
      </View>
      
      <View className="items-center">
        <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-2 relative">
          <Ionicons name="notifications-outline" size={20} color="#64748b" />
          <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-4 h-4 items-center justify-center">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminTopBar;