import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';
import NewsCard from '../../components/news/NewsCard';
import BreakingNewsCard from '../../components/news/BreakingNewsCard';
import NewsHeader from '../../components/news/NewsHeader';
import CategoryFilter from '../../components/news/CategoryFilter';
import NewsSidebar from '../../components/news/NewsSidebar';
import { useNewsData, useBreakingNews } from '../../hooks/useNewsData';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import { newsService } from '../../services/newsService';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsFeed'>;

const NewsFeedScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('NewsFeed');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  
  const { news, loading: newsLoading, error: newsError } = useNewsData(
    activeCategory === 'All' ? undefined : activeCategory
  );
  
  const { 
    breakingNews, 
    loading: breakingNewsLoading, 
    error: breakingNewsError 
  } = useBreakingNews();
  
  const loading = newsLoading || breakingNewsLoading;
  const error = newsError || breakingNewsError;

  const categories = [
    'All',
    'Politics',
    'Election',
    'Economy',
    'Law',
    'Policy',
    'Education',
    'Development'
  ];

  // Filter news based on selected category
  const filteredNews = news.filter(item => 
    activeCategory === 'All' || 
    item.category.toLowerCase() === activeCategory.toLowerCase()
  );
  
  const regularNews = filteredNews.filter(item => !item.isBreaking);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const freshNews = await newsService.getAllNews(
        activeCategory === 'All' ? undefined : activeCategory
      );
      setRefreshing(false);
    } catch (error) {
      console.error('Error refreshing news:', error);
      setRefreshing(false);
    }
  }, [activeCategory]);

  const handleNewsPress = (itemId: string) => {
    console.log('News pressed', itemId);
    const selectedNews = news.find(item => item.id === itemId);
    if (selectedNews) {
      navigation.navigate('NewsDetail', { newsItem: selectedNews });
    }
  };

  const handleBreakingNewsPress = () => {
    console.log('Breaking news pressed');
    if (breakingNews) {
      navigation.navigate('NewsDetail', { newsItem: breakingNews });
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    
    // Simple check to avoid screens that definitely need parameters
    const screensWithParams = ['NewsDetail', 'ElectionDetail', 'PoliticianProfile', 'PoliticianPromises', 'PromiseDetail', 'GrowthNewsDetail', 'ComparisonResult'];
    
    if (!screensWithParams.includes(tabName)) {
      // Cast as any to bypass TypeScript's strict checking
      navigation.navigate(tabName as any);
    } else {
      console.log(`Screen ${tabName} requires parameters`);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* News-specific sidebar */}
      <NewsSidebar 
        visible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
      
      {/* Custom Header for News & Elections with sidebar button */}
      <View className="bg-blue-600 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={toggleSidebar}
            className="mr-4"
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <View className="bg-white rounded-lg w-8 h-8 items-center justify-center">
              <Text style={{ fontSize: 16 }}>📰</Text>
            </View>
            <Text className="text-white text-xl font-bold ml-2">News & Elections</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            className="mr-4"
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Election Countdown Banner */}
        <View className="bg-blue-50 p-4 mx-4 mt-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-sm text-blue-700 font-medium mb-1">UPCOMING ELECTION</Text>
              <Text className="text-lg font-bold text-gray-800">2025 Presidential Election</Text>
              <Text className="text-sm text-gray-600 mb-2">100 days remaining</Text>
              <TouchableOpacity
                className="bg-blue-600 px-3 py-1.5 rounded-lg"
                onPress={() => navigation.navigate('ElectionCountdown')}
              >
                <Text className="text-white text-xs font-medium">Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        
        <View className="p-4">
          {/* Breaking News Section */}
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" className="my-4" />
          ) : error ? (
            <Text className="text-red-500 text-center my-4">{error}</Text>
          ) : (
            <>
              {breakingNews && activeCategory === 'All' && (
                <>
                  <NewsHeader title="Breaking News" />
                  <BreakingNewsCard 
                    item={breakingNews} 
                    onPress={() => handleBreakingNewsPress()}
                  />
                </>
              )}
              
              {/* Regular News Section */}
              <NewsHeader 
                title="Latest Updates" 
                onSeeAllPress={() => console.log('See all news')}
              />
              
              {regularNews.length > 0 ? (
                regularNews.map((item) => (
                  <NewsCard 
                    key={item.id}
                    item={item}
                    onPress={() => handleNewsPress(item.id)}
                  />
                ))
              ) : (
                <Text className="text-center py-4 text-gray-500">
                  No news found in this category
                </Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
      
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default NewsFeedScreen;