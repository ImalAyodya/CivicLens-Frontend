import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-3">
      <View className="flex-row items-center">
        <Ionicons 
          name={enabled ? "notifications" : "notifications-off"} 
          size={24} 
          color={enabled ? "#2563EB" : "#9CA3AF"} 
          className="mr-3"
        />
        <Text className="text-gray-800 font-medium">Enable Notifications</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
        thumbColor={enabled ? '#2563EB' : '#9CA3AF'}
      />
    </View>
  );
};

export default NotificationToggle;