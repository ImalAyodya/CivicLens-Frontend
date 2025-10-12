import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Politician } from "../../types/Politician";

interface Props {
  politician: Politician;
  onEdit: () => void;
  onDelete: () => void;
}

const PoliticianCard: React.FC<Props> = ({ politician, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const getImageSource = () => {
    if (imageError || !politician.image) {
      return { uri: 'https://via.placeholder.com/100x100/cccccc/666666?text=No+Image' };
    }
    return { uri: politician.image };
  };

  return (
    <View className="bg-white rounded-2xl shadow p-4 mb-3 flex-row items-center">
      {/* Profile Image */}
      <View className="w-12 h-12 rounded-full mr-4 bg-gray-200 justify-center items-center overflow-hidden">
        {imageLoading && !imageError && (
          <Ionicons name="person" size={24} color="#999" />
        )}
        <Image
          source={getImageSource()}
          className="w-12 h-12 rounded-full"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ position: imageLoading ? 'absolute' : 'relative' }}
        />
      </View>

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
 