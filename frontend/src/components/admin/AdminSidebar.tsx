import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface AdminSidebarProps {
  activeScreen: string;
  closeMenu?: () => void;
  isMobile?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeScreen, 
  closeMenu,
  isMobile = false
}) => {
  const navigation = useNavigation();
  
  const menuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: 'grid-outline',
      screen: 'AdminDashboard'
    },
    { 
      id: 'support', 
      title: 'Support Tickets', 
      icon: 'help-buoy-outline',
      screen: 'AdminSupportTickets'
    },
    { 
      id: 'resolved', 
      title: 'Resolved Tickets', 
      icon: 'checkmark-done-outline',
      screen: 'AdminResolvedTickets'
    },
    { 
      id: 'users', 
      title: 'User Management', 
      icon: 'people-outline',
      screen: 'AdminUserManagement'
    },
    { 
      id: 'reports', 
      title: 'Reports', 
      icon: 'bar-chart-outline',
      screen: 'AdminReports'
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: 'settings-outline',
      screen: 'AdminSettings'
    },
    { 
      id: 'news', 
      title: 'News Management', 
      icon: 'newspaper-outline',
      screen: 'NewsList'
    },
    { 
      id: 'elections', 
      title: 'Elections Management', 
      icon: 'calendar-outline',
      screen: 'ElectionList'
    },
  ];

  const handleNavigation = (screen: string) => {
    // @ts-ignore - navigation prop type issues
    navigation.navigate(screen);
    
    // Close the menu if on mobile
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  // Handle close menu without triggering dark mode
  const handleCloseMenu = (e: any) => {
    if (closeMenu) {
      closeMenu();
    }
  };

  const sidebarWidth = isMobile ? "w-64" : "w-56";

  return (
    <View className={`h-full bg-white border-r border-gray-200 flex-col ${sidebarWidth}`}>
      <View className="h-16 px-4 border-b border-gray-200 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-blue-50 w-8 h-8 rounded-lg justify-center items-center">
            <Ionicons name="stats-chart-outline" size={22} color="#2563EB" />
          </View>
          <Text className="text-blue-900 text-xl font-bold ml-2">CivicLens</Text>
        </View>
        
        {isMobile && (
          <TouchableOpacity onPress={handleCloseMenu}>
            <Ionicons name="close-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView className="flex-1 p-2.5">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row items-center p-3 rounded-lg my-0.5 ${
              activeScreen === item.id ? 'bg-blue-50' : ''
            }`}
            onPress={() => handleNavigation(item.screen)}
          >
            <Ionicons 
              name={item.icon as any} 
              size={20} 
              color={activeScreen === item.id ? '#2563EB' : '#64748b'} 
            />
            <Text 
              className={`ml-3 ${isMobile ? 'text-base' : 'text-sm'} ${
                activeScreen === item.id 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-500'
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center mb-4">
          <View className="w-9 h-9 rounded-full bg-blue-600 items-center justify-center mr-2.5">
            <Text className="text-white text-base font-bold">A</Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-800">Admin User</Text>
            <Text className="text-xs text-gray-500">Administrator</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          className="flex-row items-center py-2"
          onPress={() => handleNavigation('Login')}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text className="ml-2 text-red-500 text-sm">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminSidebar;