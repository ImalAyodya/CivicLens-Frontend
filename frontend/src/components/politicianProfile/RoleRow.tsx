import React from "react";
import { View, Text } from "react-native";

type RoleRowProps = { title: string; years: string; active?: boolean };

const RoleRow: React.FC<RoleRowProps> = ({ title, years, active }) => (
  <View className="flex-row items-center mb-2">
    <View
      className={`w-3 h-3 rounded-full mr-2 ${
        active ? "bg-green-500" : "bg-gray-400"
      }`}
    />
    <View>
      <Text className="font-medium">{title}</Text>
      <Text className="text-gray-500 text-sm">{years}</Text>
    </View>
  </View>
);

export default RoleRow;
