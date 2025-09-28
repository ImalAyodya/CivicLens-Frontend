import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';

const ministryTypes = ['All', 'Community', 'Technology', 'Youth', 'Environment'];

const newsData = [
  {
    id: 1,
    category: 'Community',
    title: 'Ministry Expands Outreach Programs in Rural Areas',
    description: 'The Ministry of Community Development announced a significant expansion of its outreach programs, aiming to provide essential services and support.',
    date: '2023-11-24',
    image: require('../../../assets/news-placeholder.png'),
  },
  {
    id: 2,
    category: 'Technology',
    title: 'Innovation Lab Unveils New Digital Literacy Initiative',
    description: 'A new digital literacy program, developed by the Ministry\'s innovation unit, was launched today to equip citizens with crucial online skills.',
    date: '2023-11-25',
    image: require('../../../assets/news-placeholder.png'),
  },
  {
    id: 3,
    category: 'Youth',
    title: 'Youth Development Forum Concludes with Policy Recommendations',
    description: 'The annual Youth Development Forum, hosted by the Ministry of Youth Affairs, successfully concluded presenting a comprehensive set of policy recommendations.',
    date: '2023-11-22',
    image: require('../../../assets/news-placeholder.png'),
  },
  {
    id: 4,
    category: 'Environment',
    title: 'New Environmental Initiative Launched to Combat Climate Change',
    description: 'In bold move to address environmental concerns, the Ministry of Environment has launched a groundbreaking initiative focused on sustainability.',
    date: '2023-11-20',
    image: require('../../../assets/news-placeholder.png'),
  },
];

const categoryColors: Record<string, string> = {
  Community: '#22C55E',
  Technology: '#0EA5E9',
  Youth: '#F59E42',
  Environment: '#10B981',
};

export default function GrowthNewsScreen({ navigation }: { navigation: any }) {
  const [selectedType, setSelectedType] = useState('All');

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
        {filteredNews.map(news => (
          <TouchableOpacity key={news.id} style={styles.newsCard} onPress={() => navigation.navigate('GrowthNewsDetail', { news })}>
            <Image source={news.image} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <View style={[styles.categoryTag, { backgroundColor: categoryColors[news.category] || '#2563EB' }]}>
                <Text style={styles.categoryTagText}>{news.category}</Text>
              </View>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsDesc}>{news.description}</Text>
              <View style={styles.newsMeta}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text style={styles.newsDate}>{news.date}</Text>
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
    flex: 1, // <-- Evenly distribute tabs
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 2, // Small margin for separation
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0, // <-- Prevents overflow
  },
  tabBtnActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
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
    height: 110,
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