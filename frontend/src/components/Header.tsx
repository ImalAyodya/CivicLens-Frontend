import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

// Icons (using placeholder text for now, replace with actual icons)
const MenuIcon = () => <Text style={styles.iconText}>☰</Text>;
const NotificationIcon = () => <Text style={styles.iconText}>🔔</Text>;
const ProfileIcon = () => <Text style={styles.iconText}>👤</Text>;
const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>📊</Text>
  </View>
);

interface HeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  navigation?: any; // Add navigation prop
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  navigation,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Updated menu items: Removed Politician Performance
  const menuItems: MenuItem[] = [
    { id: '1', title: 'Home', icon: '🏠', screen: 'Home' },
    { id: '2', title: 'Profile', icon: '👤', screen: 'Profile' },
    { id: '3', title: 'Compare Politicians', icon: '⚖️', screen: 'Comparison' },
    { id: '4', title: 'Political Quiz', icon: '🗳️', screen: 'PoliticalQuiz' },
    { id: '5', title: 'PoliBot Assistant', icon: '🤖', screen: 'PoliBot' },
    { id: '6', title: 'Reports', icon: '📝', screen: 'Reports' },
    { id: '7', title: 'Issues', icon: '⚠️', screen: 'Issues' },
    { id: '8', title: 'Settings', icon: '⚙️', screen: 'Settings' },
    { id: '9', title: 'Help & Support', icon: '❓', screen: 'Help' },
    { id: '10', title: 'Sign Out', icon: '🚪', screen: 'Login' },
  ];

  const handleMenuPress = () => {
    setMenuVisible(true);
    if (onMenuPress) {
      onMenuPress();
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
            <Text className="text-white text-xl font-bold ml-2">PollTrack</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onNotificationPress}
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
          {/* Dismiss area */}
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          {/* Menu area */}
          <View className="bg-white w-64 h-full shadow-lg absolute left-0 top-0 bottom-0">
            {/* Menu Header */}
            <View className="bg-blue-600 p-4">
              <View className="flex-row items-center">
                <AppLogo />
                <Text className="text-white text-xl font-bold ml-2">PollTrack</Text>
              </View>
              <Text className="text-blue-100 mt-2">Tracking Political Priorities</Text>
            </View>

            {/* Menu Items */}
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
                  <Text className="mr-3 text-lg">{item.icon}</Text>
                  <Text className="text-gray-800 text-base">{item.title}</Text>
                </TouchableOpacity>
              )}
            />

            {/* App Version */}
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
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  logoContainer: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Header;