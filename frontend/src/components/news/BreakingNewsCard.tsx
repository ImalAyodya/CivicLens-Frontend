import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NewsItem } from '../../types/news';

// Update Props interface to include onPress
type Props = {
  news: NewsItem;
  onPress: () => void;  // Add this line
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export const BreakingNewsCard = ({ news, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={news.imageUrl ? 
          { uri: news.imageUrl } : 
          require('../../../assets/news-placeholder.png')  // Local placeholder image
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BREAKING</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
        <Text style={styles.timestamp}>
          {isValidDate(news.date) ? 
            new Date(news.date).toLocaleTimeString('en-US', {
              hour: '2-digit', 
              minute: '2-digit'
            }) : 'Recent'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Make sure to have the isValidDate function
function isValidDate(dateString: string | Date | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 180,
    marginLeft: 15,
    marginRight: 5,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  badge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});