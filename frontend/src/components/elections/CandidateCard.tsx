import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Candidate } from '../../types/election';

interface CandidateCardProps {
  candidate: Candidate;
  onPress: () => void;
  expanded?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onPress, expanded = false }) => {
  // Use a placeholder image if no photoUrl is provided
  const imageSource = candidate.photoUrl 
    ? { uri: candidate.photoUrl } 
    : require('../../../assets/candidate-placeholder.png');

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        expanded ? 'flex-col' : 'flex-row items-center'
      }`}
      activeOpacity={0.7}
    >
      {expanded ? (
        <>
          <Image 
            source={imageSource}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900 mb-1">{candidate.name}</Text>
            <Text className="text-gray-600 mb-3">{candidate.party}</Text>
            
            {candidate.votes !== undefined && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Votes</Text>
                <Text className="font-medium text-gray-800">{candidate.votes.toLocaleString()}</Text>
              </View>
            )}
            
            {candidate.votePercentage !== undefined && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Vote Percentage</Text>
                <Text className="font-medium text-gray-800">{candidate.votePercentage.toFixed(2)}%</Text>
              </View>
            )}
            
            <TouchableOpacity 
              className="mt-4 bg-blue-600 rounded-lg py-3 items-center"
              onPress={onPress}
            >
              <Text className="text-white font-medium">View Profile</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Image 
            source={imageSource}
            className="w-20 h-20"
            resizeMode="cover"
          />
          <View className="flex-1 p-3">
            <Text className="text-lg font-bold text-gray-900">{candidate.name}</Text>
            <Text className="text-gray-600 mb-1">{candidate.party}</Text>
            
            {(candidate.votes !== undefined || candidate.votePercentage !== undefined) && (
              <View className="flex-row items-center mt-1">
                {candidate.votePercentage !== undefined && (
                  <Text className="text-blue-600 font-medium">
                    {candidate.votePercentage.toFixed(1)}%
                  </Text>
                )}
                {candidate.votes !== undefined && candidate.votePercentage !== undefined && (
                  <Text className="text-gray-400 mx-1">•</Text>
                )}
                {candidate.votes !== undefined && (
                  <Text className="text-gray-500">
                    {candidate.votes.toLocaleString()} votes
                  </Text>
                )}
              </View>
            )}
          </View>
          <View className="pr-4">
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CandidateCard;