import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PoliticianPromisesHeaderProps {
  navigation: any;
  pageTitle?: string;
}

const MenuIcon = () => <Ionicons name="menu" size={28} color="white" />;
const NotificationIcon = () => <Ionicons name="notifications-outline" size={24} color="white" />;
const ProfileIcon = () => <Ionicons name="person-circle-outline" size={28} color="white" />;
const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Ionicons name="stats-chart-outline" size={22} color="#2563EB" />
  </View>
);

// Combined sidebar items from both headers
const sidebarItems = [
  // Core navigation items from main header
  { id: '1', title: 'Home', icon: <Ionicons name="home-outline" size={22} color="#2563EB" />, screen: 'Home' },
  { id: '2', title: 'Dashboard', icon: <Ionicons name="grid-outline" size={22} color="#2563EB" />, screen: 'Dashboard' },
  { id: '3', title: 'Compare Politicians', icon: <Ionicons name="people-outline" size={22} color="#2563EB" />, screen: 'Comparison' },
  { id: '4', title: 'Political Quiz', icon: <Ionicons name="help-circle-outline" size={22} color="#2563EB" />, screen: 'PoliticalQuiz' },
  { id: '5', title: 'Quiz History', icon: <Ionicons name="time-outline" size={22} color="#2563EB" />, screen: 'QuizHistory' },
  { id: '6', title: 'PoliBot Assistant', icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />, screen: 'PoliBot' },
  
  // Performance features from politician promises header
  { id: '7', title: 'Politician Promises', icon: <MaterialIcons name="assignment" size={22} color="#2563EB" />, screen: 'PoliticianPromises' },
  { id: '8', title: 'Growth News', icon: <Ionicons name="trending-up" size={22} color="#2563EB" />, screen: 'GrowthNews' },
  { id: '9', title: 'Ministry Performance', icon: <FontAwesome5 name="chart-bar" size={20} color="#2563EB" />, screen: 'MinistryPerformance' },
  { id: '10', title: 'WatchList', icon: <Ionicons name="eye" size={22} color="#2563EB" />, screen: 'WatchList' },
  
  // Supporting features
  { id: '11', title: 'Help & Support', icon: <Ionicons name="information-circle-outline" size={22} color="#2563EB" />, screen: 'HelpAndSupport' },
  { id: '12', title: 'Sign Out', icon: <Ionicons name="log-out-outline" size={22} color="#2563EB" />, screen: 'Login' },
];

export default function PoliticianPromisesHeader({ navigation, pageTitle = "Politicians Promises" }: PoliticianPromisesHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2563EB' }}>
        <View className="bg-blue-600 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
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
              onPress={() => navigation.navigate('Notifications')}
              className="mr-4"
              activeOpacity={0.7}
            >
              <NotificationIcon />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
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
              data={sidebarItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 border-b border-gray-200"
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(item.screen);
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
}

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