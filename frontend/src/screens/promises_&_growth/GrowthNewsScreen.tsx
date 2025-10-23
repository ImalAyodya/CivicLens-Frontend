import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';
import axios from 'axios';

const ministryTypes = ['All', 'Community', 'Technology', 'Youth', 'Environment'];

const categoryColors: Record<string, string> = {
  Community: '#22C55E',
  Technology: '#0EA5E9',
  Youth: '#F59E42',
  Environment: '#10B981',
};

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/promise';

export default function GrowthNewsScreen({ navigation }: { navigation: any }) {
  const [selectedType, setSelectedType] = useState('All');
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/growthNews`);
      setNewsData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch news data');
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedType === 'All'
    ? newsData
    : newsData.filter(news => news.category === selectedType);

  return (
    <View style={styles.container}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Growth News" />
      {/* Ministry Type Tabs */}
      <View style={styles.tabsContainer}>
        {ministryTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.tabBtn,
              selectedType === type && styles.tabBtnActive,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.tabText,
              selectedType === type && styles.tabTextActive,
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* News List */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: '#EF4444', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : filteredNews.map(news => (
          <TouchableOpacity
            key={news._id || news.id}
            style={styles.newsCard}
            onPress={() => navigation.navigate('GrowthNewsDetail', { news })}
          >
            <Image
              source={
                news.newsImage
                  ? typeof news.newsImage === 'string'
                    ? { uri: news.newsImage }
                    : news.newsImage
                  : require('../../../assets/news-placeholder.png')
              }
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <View style={[styles.categoryTag, { backgroundColor: categoryColors[news.category] || '#2563EB' }]}>
                <Text style={styles.categoryTagText}>{news.newsCategory}</Text>
              </View>
              <Text style={styles.newsTitle}>{news.newsTitle}</Text>
              <View style={styles.newsMeta}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text style={styles.newsDate}>
                  {news.newsDate ? new Date(news.newsDate).toISOString().slice(0, 10).replace(/-/g, '-') : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNavBar activeTab="GrowthNews" onTabPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabBtnActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 12,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  newsImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  newsContent: {
    padding: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  categoryTagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  newsDesc: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  newsDate: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
});