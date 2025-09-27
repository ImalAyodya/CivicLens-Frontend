import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// Mock Sri Lankan politician data
const politicians = [
  {
    id: '1',
    name: 'Ranil Wickremesinghe',
    position: 'President',
    party: 'United National Party',
    image: '🧑‍💼',
    score: 78,
    totalPromises: 40,
    fulfilledPromises: 28,
  },
  {
    id: '2',
    name: 'Sajith Premadasa',
    position: 'Leader of the Opposition',
    party: 'Samagi Jana Balawegaya',
    image: '🧑‍💼',
    score: 72,
    totalPromises: 35,
    fulfilledPromises: 22,
  },
  {
    id: '3',
    name: 'Dinesh Gunawardena',
    position: 'Prime Minister',
    party: 'Sri Lanka Podujana Peramuna',
    image: '🧑‍💼',
    score: 81,
    totalPromises: 38,
    fulfilledPromises: 31,
  }
];

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedPolitician, setSelectedPolitician] = useState(politicians[0]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (['Home', 'Dashboard'].includes(tabName)) {
      navigation.navigate(tabName as any);
    }
  };

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
            Monitor elected officials and their promises
          </Text>
        </View>

        {/* Politician Selection */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        >
          {politicians.map(politician => (
            <TouchableOpacity
              key={politician.id}
              className={`mr-3 px-4 py-3 rounded-xl ${
                selectedPolitician.id === politician.id
                  ? 'bg-blue-600'
                  : 'bg-white border border-gray-300'
              }`}
              onPress={() => setSelectedPolitician(politician)}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-2">{politician.image}</Text>
                <View>
                  <Text 
                    className={`font-medium ${
                      selectedPolitician.id === politician.id
                        ? 'text-white'
                        : 'text-gray-800'
                    }`}
                  >
                    {politician.name}
                  </Text>
                  <Text
                    className={
                      selectedPolitician.id === politician.id
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }
                  >
                    {politician.position}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="px-4">
          {/* Performance Score Card */}
          <Card className="p-6 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  Performance Score
                </Text>
                <Text className="text-gray-500">
                  {selectedPolitician.party}
                </Text>
              </View>
              <View className="bg-blue-100 rounded-full h-16 w-16 items-center justify-center">
                <Text className="text-xl font-bold text-blue-600">{selectedPolitician.score}%</Text>
              </View>
            </View>
            
            {/* Progress bars */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Promises Fulfilled</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-3">
              <View 
                className="h-4 bg-green-500 rounded-full" 
                style={{ width: `${(selectedPolitician.fulfilledPromises / selectedPolitician.totalPromises) * 100}%` }}
              />
            </View>
            
            <Text className="text-sm font-medium text-gray-700 mb-1">Budget Efficiency</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-3">
              <View 
                className="h-4 bg-blue-500 rounded-full" 
                style={{ width: '77%' }}
              />
            </View>
            
            <Text className="text-sm font-medium text-gray-700 mb-1">Public Approval</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-2">
              <View 
                className="h-4 bg-yellow-500 rounded-full" 
                style={{ width: '65%' }}
              />
            </View>
          </Card>

          {/* Charts and Graphs (Hardcoded Example) */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Performance Trends
            </Text>
            
            {/* Placeholder for a chart */}
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <Text className="text-gray-800 font-medium mb-2">Quarterly Ratings</Text>
              <View className="flex-row h-40 items-end justify-between pt-4">
                <View className="items-center">
                  <View className="w-8 bg-blue-500 rounded-t-md" style={{ height: 50 }} />
                  <Text className="text-xs text-gray-600 mt-1">Q1</Text>
                </View>
                <View className="items-center">
                  <View className="w-8 bg-blue-500 rounded-t-md" style={{ height: 65 }} />
                  <Text className="text-xs text-gray-600 mt-1">Q2</Text>
                </View>
                <View className="items-center">
                  <View className="w-8 bg-blue-500 rounded-t-md" style={{ height: 90 }} />
                  <Text className="text-xs text-gray-600 mt-1">Q3</Text>
                </View>
                <View className="items-center">
                  <View className="w-8 bg-blue-500 rounded-t-md" style={{ height: 120 }} />
                  <Text className="text-xs text-gray-600 mt-1">Q4</Text>
                </View>
                <View className="items-center">
                  <View className="w-8 bg-green-500 rounded-t-md" style={{ height: 100 }} />
                  <Text className="text-xs text-gray-600 mt-1">Now</Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700">Total Votes</Text>
                <Text className="text-xl font-bold text-blue-700">9,320</Text>
              </View>
              <View className="bg-green-50 rounded-lg p-3 flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700">Bills Passed</Text>
                <Text className="text-xl font-bold text-green-700">21</Text>
              </View>
            </View>
          </Card>

          {/* Key Promises */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Key Promises
            </Text>
            
            <View className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-blue-700 font-semibold">Economic Stabilization</Text>
                <View className="bg-green-100 rounded-full px-2 py-1">
                  <Text className="text-xs text-green-700">Completed</Text>
                </View>
              </View>
              <Text className="text-gray-600 text-sm mb-2">Implemented new fiscal policies to stabilize the economy.</Text>
              <View className="h-1 bg-gray-100 rounded-full">
                <View className="h-1 bg-green-500 rounded-full" style={{ width: '100%' }} />
              </View>
            </View>
            
            <View className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-blue-700 font-semibold">Education Reform</Text>
                <View className="bg-yellow-100 rounded-full px-2 py-1">
                  <Text className="text-xs text-yellow-700">In Progress</Text>
                </View>
              </View>
              <Text className="text-gray-600 text-sm mb-2">Upgrading rural schools and teacher training programs.</Text>
              <View className="h-1 bg-gray-100 rounded-full">
                <View className="h-1 bg-yellow-500 rounded-full" style={{ width: '65%' }} />
              </View>
            </View>
            
            <View className="bg-white border border-gray-200 rounded-lg p-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-blue-700 font-semibold">Healthcare Access</Text>
                <View className="bg-blue-100 rounded-full px-2 py-1">
                  <Text className="text-xs text-blue-700">Planned</Text>
                </View>
              </View>
              <Text className="text-gray-600 text-sm mb-2">Expanding free healthcare services in rural areas.</Text>
              <View className="h-1 bg-gray-100 rounded-full">
                <View className="h-1 bg-blue-500 rounded-full" style={{ width: '25%' }} />
              </View>
            </View>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Recent Activities
            </Text>
            
            <View className="mb-3 pb-3 border-b border-gray-200">
              <Text className="text-gray-800 font-medium">Budget Speech 2025</Text>
              <Text className="text-gray-600 text-sm">Presented the annual budget focusing on economic recovery.</Text>
              <Text className="text-gray-500 text-xs mt-1">2 days ago</Text>
            </View>
            
            <View className="mb-3 pb-3 border-b border-gray-200">
              <Text className="text-gray-800 font-medium">Education Bill Passed</Text>
              <Text className="text-gray-600 text-sm">Approved new funding for university research.</Text>
              <Text className="text-gray-500 text-xs mt-1">1 week ago</Text>
            </View>
            
            <View>
              <Text className="text-gray-800 font-medium">Health Campaign Launched</Text>
              <Text className="text-gray-600 text-sm">Started a national vaccination drive.</Text>
              <Text className="text-gray-500 text-xs mt-1">3 weeks ago</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default DashboardScreen;