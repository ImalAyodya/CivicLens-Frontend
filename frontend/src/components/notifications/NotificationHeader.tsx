import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationHeaderProps {
  onBackPress: () => void;
  onSettingsPress: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onBackPress,
  onSettingsPress
}) => {
  return (
    <View className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onBackPress} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Notifications</Text>
      </View>
      <TouchableOpacity onPress={onSettingsPress}>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationHeader;