import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  pageTitle?: string;
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
  pageTitle = "CivicLens"
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Combined menu items from both headers
  const menuItems: MenuItem[] = [
    // Core navigation items
    { id: '1', title: 'Home', icon: <Ionicons name="home-outline" size={22} color="#2563EB" />, screen: 'Home' },
    // { id: '2', title: 'Profile', icon: <Ionicons name="person-outline" size={22} color="#2563EB" />, screen: 'Profile' },
    { id: '3', title: 'Political Hierarchy', icon: <Ionicons name="git-network-outline" size={22} color="#2563EB" />, screen: 'Hierarchy' },
    { id: '4', title: 'Compare Politicians', icon: <Ionicons name="people-outline" size={22} color="#2563EB" />, screen: 'Comparison' },
    { id: '5', title: 'Political Quiz', icon: <Ionicons name="help-circle-outline" size={22} color="#2563EB" />, screen: 'PoliticalQuiz' },
    { id: '6', title: 'Quiz History', icon: <Ionicons name="time-outline" size={22} color="#2563EB" />, screen: 'QuizHistory' },
    { id: '7', title: 'PoliBot Assistant', icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />, screen: 'PoliBot' },
    // { id: '8', title: 'Reports', icon: <Ionicons name="document-text-outline" size={22} color="#2563EB" />, screen: 'Reports' },
    // { id: '9', title: 'Issues', icon: <Ionicons name="alert-circle-outline" size={22} color="#2563EB" />, screen: 'Issues' },
    // { id: '10', title: 'Settings', icon: <Ionicons name="settings-outline" size={22} color="#2563EB" />, screen: 'Settings' },
    { id: '2', title: 'Dashboard', icon: <Ionicons name="grid-outline" size={22} color="#2563EB" />, screen: 'Dashboard' },
    { id: '3', title: 'Compare Politicians', icon: <Ionicons name="people-outline" size={22} color="#2563EB" />, screen: 'Comparison' },
    { id: '4', title: 'Political Quiz', icon: <Ionicons name="help-circle-outline" size={22} color="#2563EB" />, screen: 'PoliticalQuiz' },
    { id: '5', title: 'Quiz History', icon: <Ionicons name="time-outline" size={22} color="#2563EB" />, screen: 'QuizHistory' },
    { id: '6', title: 'PoliBot Assistant', icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />, screen: 'PoliBot' },
    
    // Performance features from politician promises
    { id: '7', title: 'Politician Promises', icon: <MaterialIcons name="assignment" size={22} color="#2563EB" />, screen: 'PoliticianPromises' },
    { id: '8', title: 'Growth News', icon: <Ionicons name="trending-up" size={22} color="#2563EB" />, screen: 'GrowthNews' },
    { id: '9', title: 'Ministry Performance', icon: <FontAwesome5 name="chart-bar" size={20} color="#2563EB" />, screen: 'MinistryPerformance' },
    { id: '10', title: 'WatchList', icon: <Ionicons name="eye" size={22} color="#2563EB" />, screen: 'WatchList' },
    
    // Supporting features
    { id: '11', title: 'Help & Support', icon: <Ionicons name="information-circle-outline" size={22} color="#2563EB" />, screen: 'HelpAndSupport' },
    { id: '12', title: 'Sign Out', icon: <Ionicons name="log-out-outline" size={22} color="#2563EB" />, screen: 'Login' },
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
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2563EB' }}>
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
              <Text className="text-white text-xl font-bold ml-2">{pageTitle}</Text>
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
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Profile');
                }
                if (onProfilePress) {
                  onProfilePress();
                }
              }}
              activeOpacity={0.7}
            >
              <ProfileIcon />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        accessibilityViewIsModal={true}
        supportedOrientations={['portrait', 'landscape']}
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
                <Text className="text-white text-xl font-bold ml-2">CivicLens</Text>
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
                    if (
                      navigation &&
                      [
                        'Home',
                        'Login',
                        'Dashboard',
                        'Hierarchy',
                        'Comparison',
                        'PoliticalQuiz',
                        'PoliBot',
                        'QuizHistory',
                        'HelpAndSupport',
                      ].includes(item.screen)
                    ) {
                    if (navigation) {
                      navigation.navigate(item.screen);
                    }
                  }}
                }>
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