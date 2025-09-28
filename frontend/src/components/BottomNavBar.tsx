import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Tab Icons (placeholder text, replace with actual icons)
const HomeIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>🏠</Text>
);

const ExploreIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>🔍</Text>
);

const NewsIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>📰</Text>
);

const DirectoryIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>📋</Text>
);

const ReportIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>📝</Text>
);

const AnalyticsIcon = ({ active }: { active: boolean }) => (
  <Text style={{ fontSize: 20, color: active ? '#2563EB' : '#6B7280' }}>📊</Text>
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
        onPress={() => onTabPress('DirectoryScreen')}
        activeOpacity={0.7}
      >
         <DirectoryIcon active={activeTab === 'DirectoryScreen'} />
        <Text className={`text-xs mt-1 ${activeTab === 'DirectoryScreen' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Directory
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
    </View>
  );
};

export default BottomNavBar;