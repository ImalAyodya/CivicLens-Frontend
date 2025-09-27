import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PromiseFulfillmentBar from './PromiseFulfillmentBar';
import type { Candidate } from '../../types/election';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <View className="bg-white rounded-lg overflow-hidden p-3 mb-3 flex-row">
      <Image 
        source={{ uri: candidate.imageUrl }}
        className="w-12 h-12 rounded-full"
        defaultSource={require('../../../assets/candidate-placeholder.png')}
      />
      
      <View className="flex-1 ml-3">
        <Text className="font-bold text-gray-800">{candidate.name}</Text>
        <Text className="text-gray-600 text-sm">{candidate.party}</Text>
        
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">{candidate.position}</Text>
            <PromiseFulfillmentBar percentage={candidate.promiseFulfillment} />
          </View>
          <Text className="text-sm font-bold text-blue-600 ml-2">
            {candidate.promiseFulfillment}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CandidateCard;