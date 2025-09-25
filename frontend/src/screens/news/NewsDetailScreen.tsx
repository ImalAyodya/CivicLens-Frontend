import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Share,
  Dimensions
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { NewsItem } from '../../types/news';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  FadeIn,
  SlideInRight,
  FadeInDown
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;
const { width } = Dimensions.get('window');

const NewsDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { newsItem } = route.params;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 700 });
    
    // Hide status bar for immersive experience
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title} - Read more on PollTrack!`,
        title: newsItem.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRelatedNewsPress = (item: NewsItem) => {
    console.log('Navigate to related news', item.id);
    // In a real app, you would navigate to the same screen with different params
    navigation.navigate('NewsDetail', { newsItem: item });
  };

  // Dummy related news
  const relatedNews: NewsItem[] = [
    {
      id: 'related1',
      title: 'Government Plans Infrastructure Projects Worth $2 Billion',
      subtitle: 'Focus on roads, bridges, and public transportation',
      date: '3h ago',
      source: 'Infrastructure Today',
      category: newsItem.category,
      readTime: '4 min read'
    },
    {
      id: 'related2',
      title: 'Opposition Criticizes New Development Plan',
      subtitle: 'Claims budget allocation is insufficient',
      date: '5h ago',
      source: 'Political Watch',
      category: newsItem.category,
      readTime: '3 min read'
    }
  ];

  // Dummy author info
  const authorInfo = {
    name: 'Sarah Johnson',
    title: 'Political Correspondent',
    avatar: 'https://i.pravatar.cc/100',
    bio: 'Covering politics and policy for over a decade.'
  };

  return (
    <View className="flex-1 bg-white">
      {/* Hero Image with Overlay and Back Button */}
      <View className="h-72 w-full relative">
        <Image
          source={require('../../../assets/parliament.png')}
          className="h-full w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Top Bar */}
        <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center p-4 pt-12">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row">
            <TouchableOpacity 
              onPress={handleShare}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center mr-2"
            >
              <Ionicons name="share-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="bookmark-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Category Tag */}
        <Animated.View 
          entering={FadeIn.delay(300).duration(500)} 
          className="absolute bottom-4 left-4 bg-blue-600 px-3 py-1 rounded-full"
        >
          <Text className="text-white text-xs font-medium">{newsItem.category}</Text>
        </Animated.View>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedContentStyle} className="px-4 pt-5 pb-24">
          {/* Article Metadata */}
          <View className="flex-row items-center mb-3">
            <Text className="text-gray-500 text-sm">{newsItem.source}</Text>
            <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
            <Text className="text-gray-500 text-sm">{newsItem.date}</Text>
            <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
            <Text className="text-gray-500 text-sm">{newsItem.readTime}</Text>
          </View>
          
          {/* Title and Subtitle */}
          <Text className="text-gray-900 text-2xl font-bold mb-3 leading-tight">
            {newsItem.title}
          </Text>
          {newsItem.subtitle && (
            <Text className="text-gray-600 text-lg mb-5 leading-relaxed">
              {newsItem.subtitle}
            </Text>
          )}
          
          {/* Author Info */}
          <Animated.View 
            entering={SlideInRight.delay(400).duration(600)} 
            className="flex-row items-center bg-gray-50 p-3 rounded-xl mb-5"
          >
            <Image 
              source={{ uri: authorInfo.avatar }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">{authorInfo.name}</Text>
              <Text className="text-sm text-gray-500">{authorInfo.title}</Text>
            </View>
            <TouchableOpacity className="bg-blue-600 px-3 py-1.5 rounded-lg">
              <Text className="text-white text-xs font-medium">Follow</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Article Content */}
          <View className="mb-8">
            <Text className="text-gray-800 leading-relaxed text-base mb-4">
              In a significant move aimed at boosting regional development, President Rajapaksa announced a comprehensive development plan for the Northern Province during a press conference held at the Presidential Secretariat yesterday.
            </Text>
            
            <Text className="text-gray-800 leading-relaxed text-base mb-4">
              The ambitious plan includes infrastructure development projects such as road renovations, water supply schemes, and electricity grid extensions. The initiative is expected to create thousands of jobs and improve the quality of life for residents in the area.
            </Text>
            
            <Image 
              source={require('../../../assets/parliament.png')}
              className="h-48 w-full rounded-xl mb-3"
              resizeMode="cover"
            />
            <Text className="text-gray-500 text-xs italic mb-5 text-center">
              President addressing the media at the Presidential Secretariat
            </Text>
            
            <Text className="text-gray-800 leading-relaxed text-base mb-4">
              "Our government is committed to ensuring equal development across all provinces," stated the President. "This comprehensive plan addresses the key needs of the Northern Province and will significantly contribute to the national economy."
            </Text>
            
            <Text className="text-gray-800 leading-relaxed text-base mb-4">
              The Minister of Finance confirmed that Rs. 50 billion has been allocated for the initial phase of the development plan. "We have secured the necessary funding, and work will commence within the next three months," he added.
            </Text>
            
            <Text className="text-gray-800 leading-relaxed text-base mb-4">
              However, opposition leaders have raised concerns about the plan's implementation timeline and questioned whether the allocated budget is sufficient to achieve the stated goals.
            </Text>
          </View>
          
          {/* Tags Section */}
          <View className="mb-8">
            <Text className="font-bold text-gray-900 text-lg mb-3">Tags</Text>
            <View className="flex-row flex-wrap">
              {['Development', 'Infrastructure', 'Northern Province', 'President', 'Economy'].map((tag) => (
                <Animated.View 
                  key={tag} 
                  entering={FadeInDown.delay(600 + Math.random() * 400).duration(400)}
                  className="bg-gray-100 rounded-full px-3 py-1.5 mr-2 mb-2"
                >
                  <Text className="text-sm text-gray-700">#{tag}</Text>
                </Animated.View>
              ))}
            </View>
          </View>
          
          {/* Related News Section */}
          <View className="mb-5">
            <Text className="font-bold text-gray-900 text-lg mb-4">Related News</Text>
            {relatedNews.map((item, index) => (
              <Animated.View 
                key={item.id}
                entering={SlideInRight.delay(800 + index * 200).duration(500)}
              >
                <TouchableOpacity 
                  onPress={() => handleRelatedNewsPress(item)}
                  className="mb-4 bg-gray-50 p-3 rounded-xl"
                >
                  <Text className="text-sm text-gray-500 mb-1">{item.source} • {item.date}</Text>
                  <Text className="text-base font-medium text-gray-800 mb-1">{item.title}</Text>
                  {item.subtitle && (
                    <Text className="text-sm text-gray-600" numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <Animated.View
        entering={FadeIn.delay(900).duration(500)}
        className="absolute bottom-6 right-6 left-6 flex-row justify-between"
      >
        <TouchableOpacity 
          className="bg-gray-800 p-4 rounded-full flex-row items-center justify-center shadow-lg"
          style={{ width: width * 0.45 }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <Text className="text-white ml-2 font-medium">Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-full flex-row items-center justify-center shadow-lg"
          style={{ width: width * 0.45 }}
        >
          <Ionicons name="heart-outline" size={20} color="white" />
          <Text className="text-white ml-2 font-medium">Like</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default NewsDetailScreen;