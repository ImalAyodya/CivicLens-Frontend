import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';
import { useAppNavigation } from '../hooks/useAppNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const { handleTabPress: navHandler } = useAppNavigation();

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Only navigate to screens that exist
    if (['Home', 'Dashboard'].includes(tabName)) {
      navigation.navigate(tabName as any);
    }
    setActiveTab(navHandler(tabName, 'Home'));
  };

  // Dummy data for featured issues
  const featuredIssues = [
    {
      id: 1,
      title: 'Road Maintenance',
      description: 'Current status of road repairs in downtown area',
      votes: 128,
      image: '🛣️',
      category: 'Infrastructure',
    },
    {
      id: 2,
      title: 'Public Park Renovation',
      description: 'Updates on the central park renovation project',
      votes: 95,
      image: '🌳',
      category: 'Environment',
    },
    {
      id: 3,
      title: 'School Budget Allocation',
      description: 'Discussion on the upcoming school budget allocation',
      votes: 87,
      image: '🏫',
      category: 'Education',
    },
  ];

  // Dummy data for recent reports
  const recentReports = [
    {
      id: 1,
      title: 'Street Light Malfunction',
      location: 'Main Street & 5th Avenue',
      status: 'In Progress',
      reporter: 'John D.',
      timeAgo: '2h ago',
    },
    {
      id: 2,
      title: 'Pothole Reported',
      location: 'Oak Street',
      status: 'Pending',
      reporter: 'Sarah M.',
      timeAgo: '5h ago',
    },
    {
      id: 3,
      title: 'Trash Collection Missed',
      location: 'Pine Neighborhood',
      status: 'Resolved',
      reporter: 'Mike T.',
      timeAgo: '1d ago',
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        navigation={navigation} // Pass navigation to the Header
        onMenuPress={() => console.log('Menu pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
        onProfilePress={() => console.log('Profile pressed')}
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Welcome Section */}
        <View className="bg-blue-500 px-4 py-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Welcome back, Citizen!
          </Text>
          <Text className="text-blue-100">
            Stay engaged with your community's priorities
          </Text>
        </View>
        
        {/* Stats Summary */}
        <View className="flex-row justify-between px-4 py-4">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
            <Text className="text-gray-500 text-xs">Active Issues</Text>
            <Text className="text-2xl font-bold text-gray-800">24</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm">
            <Text className="text-gray-500 text-xs">Your Reports</Text>
            <Text className="text-2xl font-bold text-gray-800">7</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
            <Text className="text-gray-500 text-xs">Resolved</Text>
            <Text className="text-2xl font-bold text-gray-800">15</Text>
          </View>
        </View>
        
        {/* Featured Issues Section */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Featured Issues
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600">See All</Text>
            </TouchableOpacity>
          </View>
          
          {featuredIssues.map((issue) => (
            <Card key={issue.id} className="mb-3 p-4">
              <View className="flex-row">
                <View className="h-16 w-16 bg-blue-100 rounded-lg items-center justify-center mr-3">
                  <Text style={{ fontSize: 32 }}>{issue.image}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">
                      {issue.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-blue-600 mr-1">👍</Text>
                      <Text className="text-gray-600">{issue.votes}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
                    {issue.description}
                  </Text>
                  <View className="bg-blue-100 self-start rounded-full px-2 py-1">
                    <Text className="text-xs text-blue-700">
                      {issue.category}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
        
        {/* Recent Reports Section */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Recent Reports
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600">See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentReports.map((report) => (
            <Card key={report.id} className="mb-3 p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    {report.title}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    📍 {report.location}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-xs mr-2">
                      By {report.reporter} • {report.timeAgo}
                    </Text>
                  </View>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  report.status === 'Resolved'
                    ? 'bg-green-100'
                    : report.status === 'In Progress'
                    ? 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs ${
                    report.status === 'Resolved'
                      ? 'text-green-700'
                      : report.status === 'In Progress'
                      ? 'text-yellow-700'
                      : 'text-gray-700'
                  }`}>
                    {report.status}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
        
      </ScrollView>
      
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default HomeScreen;