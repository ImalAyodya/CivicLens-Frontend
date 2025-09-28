import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="home-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

const ExploreIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="search-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

const NewsIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="newspaper-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

const ReportIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="document-text-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

const AnalyticsIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="stats-chart-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

const PerformanceIcon = ({ active }: { active: boolean }) => (
  <Ionicons name="trending-up-outline" size={22} color={active ? '#2563EB' : '#6B7280'} />
);

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View className="bg-white border-t border-gray-200 px-4 pt-2 pb-6 flex-row justify-between">
      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('Home')}
        activeOpacity={0.7}
      >
        <HomeIcon active={activeTab === 'Home'} />
        <Text className={`text-xs mt-1 ${activeTab === 'Home' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('Explore')}
        activeOpacity={0.7}
      >
        <ExploreIcon active={activeTab === 'Explore'} />
        <Text className={`text-xs mt-1 ${activeTab === 'Explore' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Explore
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('NewsFeed')}
        activeOpacity={0.7}
      >
        <NewsIcon active={activeTab === 'NewsFeed'} />
        <Text className={`text-xs mt-1 ${activeTab === 'NewsFeed' ? 'text-blue-600 font-medium' : 'text-gray-500'} text-center`} numberOfLines={2}>
          News &{"\n"}Elections
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('Report')}
        activeOpacity={0.7}
      >
        <ReportIcon active={activeTab === 'Report'} />
        <Text className={`text-xs mt-1 ${activeTab === 'Report' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Report
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('Analytics')}
        activeOpacity={0.7}
      >
        <AnalyticsIcon active={activeTab === 'Analytics'} />
        <Text className={`text-xs mt-1 ${activeTab === 'Analytics' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Analytics
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => onTabPress('Dashboard')}
        activeOpacity={0.7}
      >
        <PerformanceIcon active={activeTab === 'Dashboard'} />
        <Text className={`text-xs mt-1 ${activeTab === 'Dashboard' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Performance
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;