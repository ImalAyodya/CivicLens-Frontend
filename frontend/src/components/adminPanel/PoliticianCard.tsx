import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Politician } from "../../types/Politician";

interface Props {
  politician: Politician;
  onEdit: () => void;
  onDelete: () => void;
}

const PoliticianCard: React.FC<Props> = ({ politician, onEdit, onDelete }) => {
  return (
    <View className="bg-white rounded-2xl shadow p-4 mb-3 flex-row items-center">
      {/* Profile Image */}
      <Image
        source={{ uri: politician.image }}
        className="w-12 h-12 rounded-full mr-4"
      />

      {/* Info */}
      <View className="flex-1">
        <Text className="font-bold text-base">{politician.name}</Text>
        <Text className="text-gray-500 text-sm">
          {politician.currentRole?.title} • {politician.party?.fullName}
        </Text>
        <Text className="text-gray-400 text-xs">{politician.region}</Text>

        {/* Status */}
        <View className="flex-row items-center mt-1">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              politician.status === "Active"
                ? "bg-green-500"
                : politician.status === "Inactive"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          />
          <Text className="text-xs text-gray-600">{politician.status}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row space-x-3">
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PoliticianCard;
 