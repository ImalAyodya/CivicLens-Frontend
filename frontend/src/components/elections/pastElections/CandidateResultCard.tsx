import React from 'react';
import { View, Text, Image } from 'react-native';

interface CandidateResultProps {
  name: string;
  party: string;
  image?: string;
  votes: number;
  percentage: number;
  color: string;
  isWinner?: boolean;
}

const CandidateResultCard: React.FC<CandidateResultProps> = ({
  name,
  party,
  image,
  votes,
  percentage,
  color,
  isWinner = false
}) => {
  return (
    <View className="flex-row items-center bg-white rounded-lg p-3 mb-3">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: color }}
      >
        {image ? (
          <Image 
            source={{ uri: image }} 
            className="w-10 h-10 rounded-full"
            defaultSource={require('../../../../assets/candidate-placeholder.png')} 
          />
        ) : (
          <Text className="text-white font-bold">{name.charAt(0)}</Text>
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="font-semibold text-gray-800">{name}</Text>
          {isWinner && (
            <View className="ml-2 bg-yellow-500 rounded-sm px-1">
              <Text className="text-white text-xs font-medium">Winner</Text>
            </View>
          )}
        </View>
        <Text className="text-gray-500 text-xs">{party}</Text>
      </View>
      
      <View className="items-end">
        <Text className="font-bold text-lg" style={{ color }}>
          {percentage.toFixed(1)}%
        </Text>
        <Text className="text-gray-500 text-xs">
          {votes.toLocaleString()} votes
        </Text>
      </View>
    </View>
  );
};

export default CandidateResultCard;