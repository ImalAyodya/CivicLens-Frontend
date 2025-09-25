import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Page Title */}
        <View className="bg-blue-500 px-4 py-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Politician Performance Tracking
          </Text>
          <Text className="text-blue-100">
            Analyze how your representatives are performing
          </Text>
        </View>

        {/* Performance Score Card */}
        <View className="px-4 mt-6">
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Politician Performance Score
            </Text>
            <Text className="text-gray-700 mb-2">
              Based on promises fulfilled.
            </Text>
            <View className="flex-row items-center mb-2">
              <Text className="text-4xl font-bold text-blue-600 mr-2">82</Text>
              <Text className="text-lg text-gray-600">/ 100</Text>
            </View>
            <Text className="text-xs text-gray-500">
              Last updated: Sep 22, 2025
            </Text>
          </Card>

          {/* Charts and Graphs (Hardcoded Example) */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Performance Over Time
            </Text>
            <Text className="text-gray-700 mb-4">
              Track performance with charts and graphs.
            </Text>
            {/* Placeholder for a chart */}
            <View className="bg-blue-100 rounded-lg h-40 items-center justify-center mb-2">
              <Text className="text-blue-600 text-2xl">📈</Text>
              <Text className="text-gray-500 mt-2">[Chart Placeholder]</Text>
            </View>
            <Text className="text-xs text-gray-500">
              Promises fulfilled: 41/50 this year
            </Text>
          </Card>

          {/* More Details */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Recent Promises Fulfilled
            </Text>
            <View className="mb-2">
              <Text className="text-blue-700 font-semibold">• New Community Center Opened</Text>
              <Text className="text-gray-600 text-xs mb-1">Fulfilled: Sep 2025</Text>
            </View>
            <View className="mb-2">
              <Text className="text-blue-700 font-semibold">• Road Repairs Completed</Text>
              <Text className="text-gray-600 text-xs mb-1">Fulfilled: Aug 2025</Text>
            </View>
            <View>
              <Text className="text-blue-700 font-semibold">• School Funding Increased</Text>
              <Text className="text-gray-600 text-xs">Fulfilled: Jul 2025</Text>
            </View>
          </Card>

          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Upcoming Promises
            </Text>
            <View className="mb-2">
              <Text className="text-yellow-700 font-semibold">• Park Renovation</Text>
              <Text className="text-gray-600 text-xs mb-1">Expected: Oct 2025</Text>
            </View>
            <View>
              <Text className="text-yellow-700 font-semibold">• Public Transport Expansion</Text>
              <Text className="text-gray-600 text-xs">Expected: Dec 2025</Text>
            </View>
          </Card>

          <Card className="p-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Citizen Feedback
            </Text>
            <Text className="text-gray-700 mb-2">
              "The new community center has been a great addition!" - Jane D.
            </Text>
            <Text className="text-gray-700">
              "Looking forward to the park renovation." - Alex P.
            </Text>
          </Card>
        </View>
      </ScrollView>
      <BottomNavBar activeTab="Analytics" onTabPress={() => {}} />
    </View>
  );
};

export default DashboardScreen;