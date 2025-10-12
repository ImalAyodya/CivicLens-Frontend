import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Platform, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  activeScreen: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, activeScreen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  useEffect(() => {
    // Check if we're on a mobile-sized screen
    const checkScreenSize = () => {
      const windowWidth = Dimensions.get('window').width;
      setIsMobile(windowWidth < 768);
      setSidebarVisible(windowWidth >= 768);
    };
    
    checkScreenSize();
    
    // Add event listener for screen dimension changes
    Dimensions.addEventListener('change', checkScreenSize);
    
    // Clean up
    return () => {
      // Remove listener
      // Note: This is changed in newer React Native versions
      const dimensionListener = Dimensions.addEventListener('change', () => {});
      dimensionListener.remove();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-slate-50"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View className="flex-1 flex-row">
        {/* Sidebar with conditional rendering for mobile */}
        {sidebarVisible && (
          <View className={isMobile ? "absolute z-10 h-full shadow-lg" : ""}>
            <AdminSidebar 
              activeScreen={activeScreen} 
              closeMenu={() => setSidebarVisible(false)}
              isMobile={isMobile}
            />
          </View>
        )}
        
        {/* Main content area */}
        <View className="flex-1">
          <AdminTopBar 
            title={title} 
            showMenuButton={isMobile}
            onMenuPress={toggleSidebar}
          />
          
          {/* Semi-transparent overlay when sidebar is open on mobile */}
          {isMobile && sidebarVisible && (
            <TouchableOpacity
              className="absolute inset-0 bg-black bg-opacity-30 z-0"
              onPress={() => setSidebarVisible(false)}
              activeOpacity={1}
              style={{ height: '100%', width: '100%' }}
            />
          )}
          
          <View className="flex-1 p-4">
            {children}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminLayout;