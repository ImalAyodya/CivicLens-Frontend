import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  useWindowDimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { newsService } from '../../services/newsService';
import { NewsItem, NewsComment } from '../../types/news';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { newsItem: initialNewsItem } = route.params;
  const [newsItem, setNewsItem] = useState<NewsItem>(initialNewsItem);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(newsItem.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  
  // Create animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Create animated styles using the scrollY value
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    return {
      opacity
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -20],
      Extrapolation.CLAMP
    );
    
    return {
      transform: [{ translateY }]
    };
  });

  useEffect(() => {
    // Fetch full news details from the backend
    const fetchNewsDetails = async () => {
      try {
        const fullNewsItem = await newsService.getNewsById(newsItem.id);
        setNewsItem(fullNewsItem);
        setLikesCount(fullNewsItem.likesCount || 0);
      } catch (error) {
        console.error('Error fetching news details:', error);
      }
    };
    
    // Fetch related news
    const fetchRelatedNews = async () => {
      try {
        setRelatedLoading(true);
        const related = await newsService.getRelatedNews(newsItem.id);
        setRelatedNews(related);
        setRelatedLoading(false);
      } catch (error) {
        console.error('Error fetching related news:', error);
        setRelatedLoading(false);
      }
    };
    
    // Fetch comments
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const comments = await newsService.getComments(newsItem.id);
        setComments(comments);
        setCommentsLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setCommentsLoading(false);
      }
    };
    
    fetchNewsDetails();
    fetchRelatedNews();
    fetchComments();
  }, [newsItem.id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title} - Read more on CivicLens`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleLike = async () => {
    try {
      const result = await newsService.likeNews(newsItem.id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setAddingComment(true);
      let name = commentName.trim() || 'Anonymous';
      
      const newComment = await newsService.addComment(
        newsItem.id, 
        comment,
        name
      );
      
      setComments([...comments, newComment]);
      setComment('');
      setAddingComment(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setAddingComment(false);
    }
  };

  const handleRelatedNewsPress = (item: NewsItem) => {
    // Navigate to the same screen with new data
    navigation.push('NewsDetail', { newsItem: item });
  };

  // Dummy author info (we should fetch this from the backend in a real app)
  const authorInfo = {
    name: newsItem.author,
    title: 'Journalist',
    avatar: 'https://i.pravatar.cc/100',
    bio: 'Covering politics and policy for over a decade.'
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 bg-white">
        {/* Hero Image with Overlay and Back Button */}
        <View className="h-72 w-full relative">
          <Image
            source={typeof newsItem.imageUrl === 'string' ? { uri: newsItem.imageUrl } : newsItem.imageUrl}
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
        
        <Animated.ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Animated.View style={[contentAnimatedStyle]} className="px-4 pt-5 pb-24">
            {/* Article Metadata */}
            <View className="flex-row items-center mb-3">
              <Text className="text-gray-500">{newsItem.source}</Text>
              <View className="h-1 w-1 bg-gray-400 rounded-full mx-2" />
              <Text className="text-gray-500">{newsItem.date}</Text>
              <View className="h-1 w-1 bg-gray-400 rounded-full mx-2" />
              <Text className="text-gray-500">{newsItem.readTime}</Text>
            </View>
            
            {/* Article Title */}
            <Animated.Text 
              entering={FadeInDown.delay(100).duration(500)}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {newsItem.title}
            </Animated.Text>
            
            {/* Article Subtitle */}
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(500)}
              className="text-lg text-gray-700 mb-6"
            >
              {newsItem.subtitle}
            </Animated.Text>
            
            {/* Author Info */}
            <Animated.View 
              entering={FadeInDown.delay(300).duration(500)}
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
                {newsItem.content}
              </Text>
            </View>
            
            {/* Tags Section */}
            <View className="mb-8">
              <Text className="font-bold text-gray-900 text-lg mb-3">Related Topics</Text>
              <View className="flex-row flex-wrap">
                {newsItem.tags?.map((tag, index) => (
                  <Animated.View 
                    key={tag}
                    entering={FadeInDown.delay(400 + index * 100).duration(500)}
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
              {relatedLoading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : relatedNews.length === 0 ? (
                <Text className="text-gray-500 italic">No related news found</Text>
              ) : (
                relatedNews.map((item, index) => (
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
                ))
              )}
            </View>
            
            {/* Comments Section */}
            <View className="mb-5">
              <TouchableOpacity 
                className="flex-row justify-between items-center mb-4"
                onPress={() => setShowComments(!showComments)}
              >
                <Text className="font-bold text-gray-900 text-lg">Comments</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 mr-2">{comments.length}</Text>
                  <Ionicons 
                    name={showComments ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </View>
              </TouchableOpacity>
              
              {showComments && (
                <>
                  {commentsLoading ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : comments.length === 0 ? (
                    <Text className="text-gray-500 italic mb-4">No comments yet. Be the first to comment!</Text>
                  ) : (
                    comments.map((comment, index) => (
                      <Animated.View 
                        key={comment.id || index}
                        entering={FadeInDown.delay(index * 100).duration(300)}
                        className="bg-gray-50 p-3 rounded-xl mb-3"
                      >
                        <View className="flex-row justify-between mb-1">
                          <Text className="font-medium text-gray-800">{comment.name}</Text>
                          <Text className="text-xs text-gray-500">{comment.date}</Text>
                        </View>
                        <Text className="text-gray-700">{comment.comment}</Text>
                      </Animated.View>
                    ))
                  )}
                  
                  {/* Add comment form */}
                  <View className="mt-4 bg-gray-50 p-3 rounded-xl">
                    <TextInput
                      className="bg-white p-3 rounded-lg mb-2 text-gray-800"
                      placeholder="Your name (optional)"
                      value={commentName}
                      onChangeText={setCommentName}
                    />
                    <TextInput
                      className="bg-white p-3 rounded-lg mb-2 text-gray-800"
                      placeholder="Add a comment..."
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      value={comment}
                      onChangeText={setComment}
                    />
                    <TouchableOpacity 
                      className="bg-blue-600 py-3 rounded-lg items-center"
                      onPress={handleComment}
                      disabled={addingComment || !comment.trim()}
                    >
                      {addingComment ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-medium">Post Comment</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </Animated.ScrollView>
        
        {/* Floating Action Button */}
        <Animated.View
          entering={FadeIn.delay(900).duration(500)}
          className="absolute bottom-6 right-6 left-6 flex-row justify-between"
        >
          <TouchableOpacity 
            className="bg-gray-800 p-4 rounded-full flex-row items-center justify-center shadow-lg"
            style={{ width: width * 0.45 }}
            onPress={() => setShowComments(true)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-medium">Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-blue-600 p-4 rounded-full flex-row items-center justify-center shadow-lg"
            style={{ width: width * 0.45 }}
            onPress={handleLike}
          >
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color="white" 
            />
            <Text className="text-white ml-2 font-medium">
              {liked ? "Liked" : "Like"} · {likesCount}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewsDetailScreen;