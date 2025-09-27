import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ElectionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ElectionTabs: React.FC<ElectionTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = ['Overview', 'Results', 'Turnout', 'Insights'];
  
  return (
    <View className="flex-row border-b border-gray-200 bg-white">
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`flex-1 py-3 px-4 items-center ${
            activeTab === tab ? 'border-b-2 border-blue-600' : ''
          }`}
        >
          <Text className={activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface ElectionSummaryProps {
  electionName: string;
  winningCandidate: string;
  winningParty: string;
  turnoutPercentage: number;
}

export const ElectionSummary: React.FC<ElectionSummaryProps> = ({
  electionName,
  winningCandidate,
  winningParty,
  turnoutPercentage
}) => {
  return (
    <View className="bg-white p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="h-6 w-6 rounded-full bg-red-600 items-center justify-center mr-2">
          <Text className="text-white text-xs font-bold">YT</Text>
        </View>
        <Text className="text-lg font-bold text-gray-800">{electionName}</Text>
        <TouchableOpacity className="ml-auto">
          <Ionicons name="share-social-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-gray-500 text-xs mb-1">Winning Candidate</Text>
          <Text className="font-medium">{winningCandidate}</Text>
          <Text className="text-gray-500 text-xs">{winningParty}</Text>
        </View>
        
        <View className="bg-blue-50 p-3 rounded-lg">
          <Text className="text-center font-bold text-xl text-blue-600">{turnoutPercentage.toFixed(1)}%</Text>
          <Text className="text-blue-800 text-xs text-center">Voter Turnout</Text>
        </View>
      </View>
    </View>
  );
};