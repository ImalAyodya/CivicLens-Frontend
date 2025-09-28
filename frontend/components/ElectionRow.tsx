import React from "react";
import { View, Text } from "react-native";

type ElectionRowProps = {
  year: string;
  position: string;
  party: string;
  votes: string;
};

const ElectionRow: React.FC<ElectionRowProps> = ({ year, position, party, votes }) => (
  <View className="mb-3">
    <Text className="font-medium">{year} - {position}</Text>
    <Text className="text-gray-500 text-sm">{party} | Majority: {votes}</Text>
  </View>
);

export default ElectionRow;

