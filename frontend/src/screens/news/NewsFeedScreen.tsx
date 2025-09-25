import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';
import NewsCard from '../../components/news/NewsCard';
import BreakingNewsCard from '../../components/news/BreakingNewsCard';
import NewsHeader from '../../components/news/NewsHeader';
import CategoryFilter from '../../components/news/CategoryFilter';
import NewsSidebar from '../../components/news/NewsSidebar';
import { useNewsData } from '../../hooks/useNewsData';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsFeed'>;

const NewsFeedScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('NewsFeed');
  const { news, loading, error } = useNewsData();
  const [refreshing, setRefreshing] = useState(false);
  const { handleTabPress: navHandler } = useAppNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Category filter tabs
  const categories = ['All', 'Politics', 'Economy', 'Education', 'Healthcare', 'Infrastructure'];
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Update the handleTabPress function
  const handleTabPress = (tabName: string) => {
    setActiveTab(navHandler(tabName, 'NewsFeed'));
  };
  
  // Find breaking news
  const breakingNews = news.find(item => item.isBreaking);
  
  // Filter news by category
  const filteredNews = news.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });
  
  // Filter out breaking news from regular news
  const regularNews = filteredNews.filter(item => !item.isBreaking);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleNewsPress = (itemId: string) => {
    console.log('News pressed', itemId);
    const selectedNews = news.find(item => item.id === itemId);
    if (selectedNews) {
      navigation.navigate('NewsDetail', { newsItem: selectedNews });
    }
  };

  const handleBreakingNewsPress = (itemId: string) => {
    console.log('Breaking news pressed', itemId);
    if (breakingNews) {
      navigation.navigate('NewsDetail', { newsItem: breakingNews });
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Profile pressed')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Election Countdown Banner */}
        <View className="bg-blue-50 p-3 border-b border-blue-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-800 font-bold">Presidential Election 2024</Text>
              <Text className="text-blue-600">42 days remaining</Text>
            </View>
            <TouchableOpacity 
              className="bg-blue-600 px-3 py-1.5 rounded-lg"
              onPress={() => navigation.navigate('ElectionCountdown')}
            >
              <Text className="text-white text-xs font-medium">Details</Text>
            </TouchableOpacity>
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
                    onPress={() => handleBreakingNewsPress(breakingNews.id)}
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