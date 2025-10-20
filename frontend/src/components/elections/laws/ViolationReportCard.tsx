import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViolationReportCard: React.FC = () => {
  return (
    <View className="bg-red-50 rounded-lg p-4 mb-4 border border-red-100">
      <View className="flex-row items-center mb-3">
        <View className="h-10 w-10 rounded-full bg-red-100 items-center justify-center mr-3">
          <Ionicons name="warning-outline" size={22} color="#DC2626" />
        </View>
        <View className="flex-1">
          <Text className="text-red-800 font-bold">Report Election Law Violations</Text>
          <Text className="text-red-700 text-sm">Witnessed an election law violation?</Text>
        </View>
      </View>
      
      <Text className="text-gray-700 mb-3">
        If you've witnessed any violation of election laws such as voter intimidation, 
        bribery, or campaign violations, report it to authorities immediately.
      </Text>
      
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-white border border-red-200 py-2 px-4 rounded-lg flex-row items-center">
          <Ionicons name="call-outline" size={18} color="#DC2626" />
          <Text className="text-red-700 ml-2 font-medium">1950</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-red-600 py-2 px-4 rounded-lg flex-row items-center">
          <Ionicons name="document-text-outline" size={18} color="white" />
          <Text className="text-white ml-2 font-medium">Report Online</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViolationReportCard;