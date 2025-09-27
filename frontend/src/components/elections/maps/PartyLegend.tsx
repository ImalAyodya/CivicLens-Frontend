import React from 'react';
import { View, Text } from 'react-native';

interface Party {
  id: string;
  name: string;
  color: string;
}

interface PartyLegendProps {
  parties: Party[];
}

const PartyLegend: React.FC<PartyLegendProps> = ({ parties }) => {
  return (
    <View className="bg-white p-4 rounded-lg mb-4">
      <Text className="font-bold text-gray-800 mb-2">Party Legend</Text>
      <View className="flex-row flex-wrap">
        {parties.map((party) => (
          <View key={party.id} className="flex-row items-center mr-4 mb-2">
            <View
              style={{
                backgroundColor: party.color,
                width: 12,
                height: 12,
                borderRadius: 6,
                marginRight: 4
              }}
            />
            <Text className="text-gray-700 text-xs">{party.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PartyLegend;