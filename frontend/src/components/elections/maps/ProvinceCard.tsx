import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import CandidateResultMini from './CandidateResultMini';

interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

interface ProvinceCardProps {
  province: {
    id: string;
    name: string;
    winningParty: string;
    winningPercentage: number;
    voterTurnout: number;
    candidates: Candidate[];
  };
  expanded: boolean;
  onToggleExpand: () => void;
}

const ProvinceCard: React.FC<ProvinceCardProps> = ({ 
  province, 
  expanded, 
  onToggleExpand 
}) => {
  return (
    <Animated.View 
      className="bg-white rounded-lg mb-4 overflow-hidden"
      entering={FadeInRight.delay(200).duration(400)}
    >
      {/* Header */}
      <TouchableOpacity 
        className="flex-row items-center justify-between p-4"
        activeOpacity={0.7}
        onPress={onToggleExpand}
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
            <Text className="text-blue-600 font-bold">{province.name.charAt(0)}</Text>
          </View>
          <View>
            <Text className="font-semibold text-gray-800">{province.name}</Text>
            <Text className="text-gray-500 text-xs">
              {province.winningParty} winning party
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-bold text-lg text-blue-600">
            {province.winningPercentage.toFixed(1)}%
          </Text>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6B7280" 
          />
        </View>
      </TouchableOpacity>

      {/* Details (expandable) */}
      {expanded && (
        <View className="px-4 pb-4 border-t border-gray-100">
          {/* Voter turnout */}
          <View className="mb-3 mt-2">
            <Text className="text-gray-700 mb-1">Voter Turnout</Text>
            <View className="flex-row items-center">
              <View className="flex-1 bg-gray-200 h-2 rounded-full mr-3 overflow-hidden">
                <View 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${province.voterTurnout}%` }}
                />
              </View>
              <Text className="font-semibold text-gray-800">
                {province.voterTurnout.toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Top candidates */}
          <Text className="text-gray-700 mb-2">Top Candidates</Text>
          {province.candidates.map(candidate => (
            <CandidateResultMini 
              key={candidate.id}
              candidate={candidate}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default ProvinceCard;