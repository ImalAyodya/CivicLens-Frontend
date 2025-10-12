import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { useNewsData, useBreakingNews } from '../../hooks/useNewsData';
import { NewsCard } from '../../components/news/NewsCard';
import { BreakingNewsCard } from '../../components/news/BreakingNewsCard';
import CategoryFilter from '../../components/news/CategoryFilter';
import NewsHeader from '../../components/news/NewsHeader';
import { NewsCategory, NewsItem } from '../../types/news';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import NewsSidebar from '../../components/news/NewsSidebar';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar from '../../components/BottomNavBar';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsFeed'>;

const { width } = Dimensions.get('window');
const BREAKING_ITEM_WIDTH = width - 32; // Full width minus padding
const BREAKING_ITEM_SPACING = 10;

const NewsFeedScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('NewsFeed');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | undefined>(undefined);
  const { news, loading: newsLoading, error: newsError } = useNewsData(selectedCategory);
  const { breakingNews, loading: breakingLoading, error: breakingError } = useBreakingNews();
  const [refreshing, setRefreshing] = useState(false);
  const { handleTabPress: navHandler } = useAppNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentBreakingIndex, setCurrentBreakingIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const breakingFlatListRef = useRef<FlatList>(null);
  
  // Category filter tabs
  const categories = ['All', 'Politics', 'Economy', 'Education', 'Healthcare', 'Infrastructure'];
  const [activeCategory, setActiveCategory] = useState('All');
  
  const handleTabPress = (tabName: string) => {
  setActiveTab(tabName);
  if (
    ['Home', 'Dashboard', 'NewsFeed', 'PoliticianPromises'].includes(tabName)
  ) {
    navigation.navigate(tabName as never);
  }
};
  
  // Get breaking news - filter from both sources
  const breakingNewsItems = React.useMemo(() => {
    // Get breaking news from the dedicated breaking news endpoint
    const dedicatedBreakingNews = Array.isArray(breakingNews) ? breakingNews : [];
    
    // Get breaking news from regular news (if any weren't included in the dedicated endpoint)
    const regularBreakingNews = Array.isArray(news) 
      ? news.filter(item => item?.isBreaking && 
          !dedicatedBreakingNews.some(b => b._id === item._id))
      : [];
    
    // Combine both sources, remove duplicates
    return [...dedicatedBreakingNews, ...regularBreakingNews];
  }, [news, breakingNews]);
  
  // Filter news by category - add null check
  const filteredNews = Array.isArray(news) ? news.filter(item => {
    if (!item) return false; // Skip null/undefined items
    if (activeCategory === 'All') return true;
    
    // Case-insensitive comparison
    return item.category && 
      item.category.toLowerCase() === activeCategory.toLowerCase();
  }) : [];
  
  // Filter out breaking news - add null check
  const regularNews = Array.isArray(filteredNews) ? filteredNews.filter(item => 
    !breakingNewsItems.some(breaking => breaking._id === item._id)
  ) : [];
  
  // Auto-scroll breaking news carousel
  useEffect(() => {
    if (breakingNewsItems.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextIndex = (currentBreakingIndex + 1) % breakingNewsItems.length;
      breakingFlatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewOffset: 0,
        viewPosition: 0
      });
      setCurrentBreakingIndex(nextIndex);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentBreakingIndex, breakingNewsItems.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Handle news item press
  const handleNewsPress = (itemId: string) => {
    console.log('News pressed', itemId);
    const selectedNews = Array.isArray(news) ? news.find(item => item?._id === itemId) : undefined;
    if (selectedNews) {
      navigation.navigate('NewsDetail', { newsId: selectedNews._id });
    }
  };

  // Handle breaking news press
  const handleBreakingNewsPress = (itemId: string) => {
    console.log('Breaking news pressed', itemId);
    navigation.navigate('NewsDetail', { newsId: itemId });
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Update category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category as NewsCategory);
  };

  // Render breaking news item
  const renderBreakingNewsItem = ({ item, index }: { item: NewsItem; index: number }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.breakingNewsItem,
          { width: BREAKING_ITEM_WIDTH }
        ]}
        activeOpacity={0.9}
        onPress={() => handleBreakingNewsPress(item._id)}
      >
        <LinearGradient
          colors={['#ff3b30', '#ff9500']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.breakingGradient}
        >
          <View style={styles.breakingContent}>
            <View style={styles.breakingBadgeContainer}>
              <View style={styles.breakingPulse} />
              <Text style={styles.breakingBadgeText}>BREAKING NEWS</Text>
            </View>
            <Text style={styles.breakingTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.breakingCategory}>{item.category}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Render pagination dots for breaking news
  const renderPaginationDots = () => {
    if (breakingNewsItems.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {breakingNewsItems.map((_, index) => {
          const inputRange = [
            (index - 1) * BREAKING_ITEM_WIDTH,
            index * BREAKING_ITEM_WIDTH,
            (index + 1) * BREAKING_ITEM_WIDTH
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });
          
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp'
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                { width: dotWidth, opacity: dotOpacity }
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Handle on scroll for pagination
  const handleOnScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Handle on view change
  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentBreakingIndex(viewableItems[0].index);
    }
  }).current;

  if (newsLoading || breakingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (newsError || breakingError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {newsError || breakingError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* News-specific sidebar */}
      <NewsSidebar 
        visible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
      
      {/* Custom Header for News & Elections with sidebar button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.headerIconContainer}>
              <Text style={{ fontSize: 16 }}>📰</Text>
            </View>
            <Text style={styles.headerText}>News & Elections</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.notificationButton}
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Election Countdown Banner */}
        <View style={styles.countdownBanner}>
          <View style={styles.countdownContent}>
            <View>
              <Text style={styles.countdownTitle}>Presidential Election 2024</Text>
              <Text style={styles.countdownSubtitle}>42 days remaining</Text>
            </View>
            <TouchableOpacity 
              style={styles.countdownButton}
              onPress={() => navigation.navigate('ElectionCountdown')}
            >
              <Text style={styles.countdownButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Breaking News Carousel */}
        {breakingNewsItems.length > 0 && (
          <View style={styles.breakingNewsSection}>
            <View style={styles.sectionHeaderContainer}>
              <Ionicons name="flash" size={18} color="#ff3b30" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Breaking News</Text>
            </View>
            
            <Animated.FlatList
              ref={breakingFlatListRef}
              data={breakingNewsItems}
              keyExtractor={(item) => item._id}
              renderItem={renderBreakingNewsItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.breakingListContent}
              snapToInterval={BREAKING_ITEM_WIDTH + BREAKING_ITEM_SPACING}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handleOnScroll}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />
            
            {renderPaginationDots()}
          </View>
        )}

        {/* Categories Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        <View style={styles.newsContainer}>
          {/* Regular News Section */}
          <View style={styles.regularNewsSection}>
            <View style={styles.sectionHeaderContainer}>
              <Ionicons name="newspaper-outline" size={18} color="#0066cc" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Latest Updates</Text>
            </View>
            
            {newsLoading ? (
              <ActivityIndicator size="large" color="#2563EB" style={styles.newsLoading} />
            ) : newsError ? (
              <Text style={styles.newsError}>{newsError}</Text>
            ) : (
              <>
                {regularNews.length > 0 ? (
                  regularNews.map((item) => (
                    <NewsCard 
                      key={item._id}
                      news={item}
                      onPress={() => handleNewsPress(item._id)}
                    />
                  ))
                ) : (
                  <View style={styles.emptyNewsContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#cccccc" />
                    <Text style={styles.emptyNewsText}>
                      No news found in this category
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
  countdownBanner: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cce4ff',
  },
  countdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownTitle: {
    color: '#003c78',
    fontWeight: 'bold',
    fontSize: 15,
  },
  countdownSubtitle: {
    color: '#0066cc',
    fontSize: 13,
  },
  countdownButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  countdownButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  breakingNewsSection: {
    marginVertical: 16,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  breakingListContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  breakingNewsItem: {
    marginRight: BREAKING_ITEM_SPACING,
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  breakingGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  breakingContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  breakingBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakingPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  breakingBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  breakingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  breakingCategory: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066cc',
    marginHorizontal: 4,
  },
  newsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  regularNewsSection: {
    marginBottom: 16,
  },
  newsLoading: {
    marginVertical: 20,
  },
  newsError: {
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyNewsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 16,
  },
  emptyNewsText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default NewsFeedScreen;