import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import type { NewsItem } from '../../types/news';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewsFeed'>;

interface BreakingNewsCardProps {
  item: NewsItem;
  onPress?: () => void;
}

const BreakingNewsCard: React.FC<BreakingNewsCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    navigation.navigate('NewsDetail', { newsItem: item });
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.9}
      className="mb-4"
    >
      <View className="relative rounded-xl overflow-hidden h-48 mb-1">
        <ImageBackground 
          source={require('../../../assets/parliament.png')}
          className="w-full h-full"
        >
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40" />
          
          <View className="absolute top-3 left-3 bg-red-500 rounded-full px-3 py-1 flex-row items-center">
            <View className="w-2 h-2 bg-white rounded-full mr-1" />
            <Text className="text-white text-xs font-medium">Breaking</Text>
          </View>
          
          <View className="absolute bottom-0 p-4">
            <Text className="text-white text-xl font-bold mb-1" numberOfLines={2}>
              {item.title}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white/80 text-xs">{item.source} • {item.date}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default BreakingNewsCard;