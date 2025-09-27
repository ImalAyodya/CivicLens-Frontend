import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import type { NewsItem } from '../../types/news';
import Card from '../Card';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewsFeed'>;

interface NewsCardProps {
  item: NewsItem;
  onPress?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    navigation.navigate('NewsDetail', { newsItem: item });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card className="mb-3">
        <View className="flex-row p-3">
          {item.imageUrl && (
            <View className="w-24 h-24 rounded-lg overflow-hidden mr-3">
              <Image 
                source={require('../../../assets/news-placeholder.png')} 
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}
          <View className="flex-1 justify-between py-1">
            <View>
              <Text className="text-gray-500 text-xs mb-1">{item.source} • {item.date}</Text>
              <Text className="text-gray-900 font-semibold mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <View className="bg-blue-100 rounded-full px-2 py-1">
                <Text className="text-xs text-blue-700">{item.category}</Text>
              </View>
              <Text className="text-gray-500 text-xs">{item.readTime}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NewsCard;