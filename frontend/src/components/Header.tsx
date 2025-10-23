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

  // Combined menu items from both versions
  const menuItems: MenuItem[] = [
    { id: '1', title: 'Political Hierarchy', icon: <Ionicons name="git-network-outline" size={22} color="#2563EB" />, screen: 'Hierarchy' },
    { id: '2', title: 'Compare Politicians', icon: <Ionicons name="people-outline" size={22} color="#2563EB" />, screen: 'Comparison' },
    { id: '3', title: 'Political Quiz', icon: <Ionicons name="help-circle-outline" size={22} color="#2563EB" />, screen: 'PoliticalQuiz' },
    { id: '4', title: 'Quiz History', icon: <Ionicons name="time-outline" size={22} color="#2563EB" />, screen: 'QuizHistory' },
    { id: '5', title: 'PoliBot Assistant', icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />, screen: 'PoliBot' },
    { id: '6', title: 'Virtual Election', icon: <Ionicons name="checkbox-outline" size={22} color="#2563EB" />, screen: 'ElectionScreen' },
    { id: '7', title: 'Add Election', icon: <Ionicons name="add-circle-outline" size={22} color="#2563EB" />, screen: 'AddElectionScreen' },
    { id: '8', title: 'All Parties', icon: <Ionicons name="flag-outline" size={22} color="#2563EB" />, screen: 'PoliticalPartyList' },
    { id: '9', title: 'Help & Support', icon: <Ionicons name="information-circle-outline" size={22} color="#2563EB" />, screen: 'HelpAndSupport' },
    { id: '10', title: 'Sign Out', icon: <Ionicons name="log-out-outline" size={22} color="#2563EB" />, screen: 'Login' },
    { id: '11', title: 'Election Countdown', icon: <Ionicons name="timer-outline" size={22} color="#2563EB" />, screen: 'ElectionCountdown' },
    { id: '12', title: 'Past Elections', icon: <Ionicons name="albums-outline" size={22} color="#2563EB" />, screen: 'PastElections' },
    { id: '13', title: 'Growth News', icon: <Ionicons name="trending-up" size={22} color="#2563EB" />, screen: 'GrowthNews' },
    { id: '14', title: 'Ministry Performance', icon: <FontAwesome5 name="chart-bar" size={20} color="#2563EB" />, screen: 'MinistryPerformance' },
    { id: '15', title: 'Civic Insight Score', icon: <Ionicons name="eye" size={22} color="#2563EB" />, screen: 'PublicEngagementScore' },
   
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
                  // Support both UserProfile and Profile navigation
                  navigation.navigate('UserProfile');
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
                    if (navigation) {
                      // Add explicit navigation for All Parties
                      if (item.screen === 'PoliticalPartyList') {
                        navigation.navigate('PoliticalPartyList');
                      } else if ([
                        'Home',
                        'Login',
                        'Dashboard',
                        'Hierarchy',
                        'Comparison',
                        'PoliticalQuiz',
                        'PoliBot',
                        'QuizHistory',
                        'ElectionScreen',
                        'AddElectionScreen',
                        'HelpAndSupport',
                        'Notifications', 'Profile',
                        'PublicEngagementScore', 'MinistryPerformance', 'GrowthNews',
                        'PastElections', 'ElectionCountdown'
                      ].includes(item.screen)) {
                        navigation.navigate(item.screen);
                      } else {
                        console.log(`Screen ${item.screen} not implemented yet`);
                      }
                    }
                  }}
                >
                  <View style={{ marginRight: 12 }}>{item.icon}</View>
                  <Text className="text-gray-800 text-base">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <View className="mt-auto p-4">
              {/* Election Status Section */}
              <View className="bg-gray-50 p-4 mb-2 rounded-lg">
                <Text className="text-sm text-gray-500 mb-1">Next General Election</Text>
                <Text className="text-base text-gray-900 font-medium mb-2">Presidential Election 2024</Text>
                <View className="bg-blue-50 rounded-lg p-3">
                  <View className="flex-row justify-between">
                    <Text className="text-blue-800 font-medium">Countdown</Text>
                    <Text className="text-blue-800 font-bold">42 days</Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <View className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
                  </View>
                </View>
              </View>
              {/* Version */}
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