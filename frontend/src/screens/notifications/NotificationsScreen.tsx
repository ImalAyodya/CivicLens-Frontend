import React from 'react';
import { View, FlatList, ActivityIndicator, Text, SafeAreaView, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import BlueHeader from '../../components/BlueHeader';
import NotificationItem from '../../components/notifications/NotificationItem';
import NotificationToggle from '../../components/notifications/NotificationToggle';
import { useNotifications } from '../../hooks/useNotifications';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { 
    notifications, 
    loading, 
    error, 
    notificationsEnabled,
    toggleNotifications,
    markAsRead
  } = useNotifications();

  const handleNotificationPress = (id: string) => {
    markAsRead(id);
    // In a real app, you might navigate to a specific screen based on notification type
    console.log('Notification pressed:', id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <BlueHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <NotificationToggle 
              enabled={notificationsEnabled}
              onToggle={toggleNotifications}
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
              <NotificationItem 
                notification={item}
                onPress={handleNotificationPress}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500 text-center">No notifications</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;