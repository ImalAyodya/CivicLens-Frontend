import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  StyleSheet,
  Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { NewsItem } from '../../types/news';
import { newsService } from '../../services/newsService';
import NewsCard from '../../components/news/NewsCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const NewsSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      Keyboard.dismiss();
      setLoading(true);
      setError(null);
      
      const data = await newsService.searchNews(searchQuery.trim());
      setResults(data);
      
      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        const updatedRecentSearches = [searchQuery, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedRecentSearches);
        // In a real app, you'd save this to AsyncStorage
      }
    } catch (error) {
      console.error('Error searching news:', error);
      setError('Failed to search news');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
  };

  const handleRecentSearchTap = (query: string) => {
    setSearchQuery(query);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleNewsPress = (item: NewsItem) => {
    navigation.navigate('NewsDetail', { newsItem: item });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with search bar */}
      <View className="bg-blue-600 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search news..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity onPress={handleClear}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
      
      {/* Search results or recent searches */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity 
              className="mt-4 bg-blue-600 px-5 py-2 rounded-lg"
              onPress={handleSearch}
            >
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="px-4 py-2">
                <NewsCard 
                  item={item}
                  onPress={() => handleNewsPress(item)}
                />
              </View>
            )}
            ListHeaderComponent={
              <Text className="px-4 pt-4 pb-2 text-gray-600">
                {results.length} results for "{searchQuery}"
              </Text>
            }
          />
        ) : searchQuery && !loading ? (
          <View className="flex-1 justify-center items-center p-4">
            <Ionicons name="search-outline" size={48} color="#CBD5E1" />
            <Text className="mt-4 text-gray-400 text-center">
              No results found for "{searchQuery}"
            </Text>
          </View>
        ) : (
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</Text>
            {recentSearches.length > 0 ? (
              recentSearches.map((query, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center py-3 border-b border-gray-100"
                  onPress={() => handleRecentSearchTap(query)}
                >
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700">{query}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-gray-400 italic">No recent searches</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default NewsSearchScreen;