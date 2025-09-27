import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onPress: (id: string) => void;
}

const getIconByType = (type: string, iconText?: string) => {
  if (iconText) return iconText;

  const icons: Record<string, string> = {
    'alert': '🔔',
    'event': '📅',
    'fact': 'ℹ️',
    'update': '🔄',
    'poll': '📊',
    'law': '⚖️',
    'performance': '📈',
    'promise': '✅',
  };

  return icons[type] || '📣';
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const { id, title, description, timestamp, type, priority, read, count, icon, color } = notification;
  
  const getBgColor = () => {
    if (color) return color;
    
    switch (priority) {
      case 'urgent': return '#FF4C3F';
      case 'high': return '#FFA726';
      case 'medium': return '#42A5F5';
      case 'low': return '#9E9E9E';
      case 'info': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const iconToDisplay = getIconByType(type, icon);

  return (
    <TouchableOpacity 
      className={`mb-3 rounded-lg overflow-hidden ${read ? 'opacity-80' : ''}`}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <View style={{ backgroundColor: getBgColor() }} className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">{iconToDisplay}</Text>
            <Text className="text-white font-bold">{title}</Text>
          </View>
          {count !== undefined && (
            <View className="bg-white rounded-full w-8 h-8 items-center justify-center">
              <Text className="font-bold text-blue-600">{count}</Text>
            </View>
          )}
        </View>
        <Text className="text-white mt-1 mb-2">{description}</Text>
        <Text className="text-white/80 text-sm">{timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;