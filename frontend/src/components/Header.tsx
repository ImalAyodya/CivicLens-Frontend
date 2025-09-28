import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuIcon = () => <Ionicons name="menu" size={28} color="white" />;
const NotificationIcon = () => <Ionicons name="notifications-outline" size={24} color="white" />;
const ProfileIcon = () => <Ionicons name="person-circle-outline" size={28} color="white" />;
const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Ionicons name="stats-chart-outline" size={22} color="#2563EB" />
  </View>
);

interface HeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  navigation?: any;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  screen: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  navigation,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { id: '1', title: 'Home', icon: <Ionicons name="home-outline" size={22} color="#2563EB" />, screen: 'Home' },
    { id: '2', title: 'Profile', icon: <Ionicons name="person-outline" size={22} color="#2563EB" />, screen: 'Profile' },
    { id: '3', title: 'Compare Politicians', icon: <Ionicons name="people-outline" size={22} color="#2563EB" />, screen: 'Comparison' },
    { id: '4', title: 'Political Quiz', icon: <Ionicons name="help-circle-outline" size={22} color="#2563EB" />, screen: 'PoliticalQuiz' },
    { id: '5', title: 'PoliBot Assistant', icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />, screen: 'PoliBot' },
    { id: '6', title: 'Reports', icon: <Ionicons name="document-text-outline" size={22} color="#2563EB" />, screen: 'Reports' },
    { id: '7', title: 'Issues', icon: <Ionicons name="alert-circle-outline" size={22} color="#2563EB" />, screen: 'Issues' },
    { id: '8', title: 'Settings', icon: <Ionicons name="settings-outline" size={22} color="#2563EB" />, screen: 'Settings' },
    { id: '9', title: 'Help & Support', icon: <Ionicons name="information-circle-outline" size={22} color="#2563EB" />, screen: 'Help' },
    { id: '10', title: 'Sign Out', icon: <Ionicons name="log-out-outline" size={22} color="#2563EB" />, screen: 'Login' },
  ];

  const handleMenuPress = () => {
    setMenuVisible(true);
    if (onMenuPress) {
      onMenuPress();
    }
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate('Notifications');
    }
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <>
      <View className="bg-blue-600 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleMenuPress}
            className="mr-4"
            activeOpacity={0.7}
          >
            <MenuIcon />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <AppLogo />
            <Text className="text-white text-xl font-bold ml-2">CivicLens</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleNotificationPress}
            className="mr-4"
            activeOpacity={0.7}
          >
            <NotificationIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <ProfileIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View className="bg-white w-64 h-full shadow-lg absolute left-0 top-0 bottom-0">
            <View className="bg-blue-600 p-4">
              <View className="flex-row items-center">
                <AppLogo />
                <Text className="text-white text-xl font-bold ml-2">CivicLence</Text>
              </View>
              <Text className="text-blue-100 mt-2">Tracking Political Priorities</Text>
            </View>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 border-b border-gray-200"
                  onPress={() => {
                    setMenuVisible(false);
                    if (navigation && ['Home', 'Login', 'Dashboard', 'Comparison', 'PoliticalQuiz', 'PoliBot'].includes(item.screen)) {
                      navigation.navigate(item.screen);
                    } else {
                      console.log(`Screen ${item.screen} not implemented yet`);
                    }
                  }}
                >
                  <View style={{ marginRight: 12 }}>{item.icon}</View>
                  <Text className="text-gray-800 text-base">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <View className="mt-auto p-4">
              <Text className="text-gray-500 text-xs">Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Header;