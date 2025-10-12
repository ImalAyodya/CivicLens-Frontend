import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NewsItem } from '../../types/news';

// Update Props interface to include onPress
type Props = {
  news: NewsItem;
  onPress: () => void; // Add this line
};

function isValidDate(dateString: string | Date): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export const NewsCard = ({ news, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: news.imageUrl || 'https://via.placeholder.com/100x100' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>{news.summary}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>
            {isValidDate(news.date) ? 
              new Date(news.date).toLocaleDateString('en-US', {
                month: 'short', 
                day: 'numeric'
              }) : 'Recent'}
          </Text>
          <Text style={styles.category}>{news.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  category: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
  },
});