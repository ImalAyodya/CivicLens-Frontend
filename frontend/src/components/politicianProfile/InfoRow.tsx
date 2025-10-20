import React from "react";
import { View, Text } from "react-native";

type InfoRowProps = { label: string; value: string };

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View className="flex-row justify-between py-1">
    <Text className="text-gray-600">{label}</Text>
    <Text className="font-medium">{value}</Text>
  </View>
);

export default InfoRow;