import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Share,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { newsService } from '../../services/newsService';
import { NewsItem } from '../../types/news';
import { Ionicons } from '@expo/vector-icons';

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

const { width } = Dimensions.get('window');

export default function NewsDetailScreen() {
  const route = useRoute<NewsDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { newsId } = route.params;
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        
        // Check if ID is in a valid MongoDB ObjectId format
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(newsId);
        
        if (!isValidObjectId) {
          console.warn(`Invalid news ID format: ${newsId}`);
          setError('Invalid news ID format');
          setLoading(false);
          return;
        }
        
        const newsItem = await newsService.getNewsById(newsId);
        
        if (!newsItem) {
          setError('News not found');
        } else {
          setNews(newsItem);
          console.log('News detail loaded:', newsItem.title);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching news details:', err);
        setError('Failed to load news details');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  const handleShare = async () => {
    if (!news) return;
    
    try {
      await Share.share({
        message: `${news.title}\n\n${news.summary}\n\nRead more on CivicLens`,
        title: news.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !news) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#0066cc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff3b30" />
          <Text style={styles.errorText}>
            {error || 'News article not found'}
          </Text>
          <TouchableOpacity 
            style={styles.tryAgainButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.tryAgainText}>Return to News</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = isValidDate(news.date) 
    ? new Date(news.date).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) 
    : 'Publication date not available';

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#0066cc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#0066cc" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Category Badge */}
        <View style={styles.categoryBadgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{news.category}</Text>
          </View>
          {news.isBreaking && (
            <View style={styles.breakingBadge}>
              <Text style={styles.breakingBadgeText}>BREAKING</Text>
            </View>

          )}
        </View>
        
        {/* Title */}
        <Text style={styles.title}>{news.title}</Text>
        
        {/* Author & Date */}
        <View style={styles.metadata}>
          {news.author && <Text style={styles.author}>By {news.author}</Text>}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        {/* Main Image */}
        {news.imageUrl ? (
          <Image 
            source={{ uri: news.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color="#999" />
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
        
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summary}>{news.summary}</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.body}>{news.content}</Text>
        </View>
        
        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Related Topics:</Text>
            <View style={styles.tagsList}>
              {news.tags.map((tag, index) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Spacing at bottom */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function
function isValidDate(dateString: string | Date): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
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
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBadgeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e8f1fa',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  breakingBadge: {
    backgroundColor: '#ffebeb',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
  },
  breakingBadgeText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    color: '#222',
  },
  metadata: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  date: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  author: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  image: {
    width: width,
    height: width * 0.6,
  },
  imagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  summary: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: '#333',
  },
  tagsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  }
});