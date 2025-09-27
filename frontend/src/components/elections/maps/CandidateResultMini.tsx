import React from 'react';
import { View, Text } from 'react-native';

interface CandidateResultMiniProps {
  candidate: {
    id: string;
    name: string;
    party: string;
    votes: number;
    percentage: number;
    color: string;
  };
}

const CandidateResultMini: React.FC<CandidateResultMiniProps> = ({ candidate }) => {
  return (
    <View className="mb-2">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View 
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: candidate.color }}
          />
          <Text className="font-medium text-sm">
            {candidate.name} ({candidate.party})
          </Text>
        </View>
        <Text className="font-semibold text-sm">{candidate.percentage.toFixed(1)}%</Text>
      </View>
      <View className="mt-1 mb-2">
        <View className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full" 
            style={{ 
              width: `${candidate.percentage}%`,
              backgroundColor: candidate.color 
            }} 
          />
        </View>
      </View>
    </View>
  );
};

export default CandidateResultMini;