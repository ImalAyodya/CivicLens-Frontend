import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';

const categories = ['ALL', 'Education', 'Health', 'Economy', 'Others'];
const statuses = ['All', 'complete', 'pending', 'broken'];

const statusColors: Record<string, { bg: string; text: string }> = {
  complete: { bg: '#D1FAE5', text: '#059669' },
  pending: { bg: '#FEF3C7', text: '#B45309' },
  broken: { bg: '#FEE2E2', text: '#B91C1C' },
};

const getStatusColor = (status: string) =>
  statusColors[status] || { bg: '#E5E7EB', text: '#6B7280' };

// Configure Axios base URL
const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/promise/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function PoliticianPromisesScreen() {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('PoliticianPromises');
  const [promises, setPromises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) setActiveTab('PoliticianPromises');
  }, [isFocused]);

  useEffect(() => {
    fetchPromises();
  }, []);

  const fetchPromises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching promises from:', `${API_BASE_URL}/promises`);
      
      const response = await api.get('/promises');
      
      console.log('Response received:', response.data);
      
      const data = response.data;
      setPromises(Array.isArray(data) ? data : []);
      
      // Debug info
      if (Array.isArray(data) && data.length > 0) {
        console.log('First promise structure:', JSON.stringify(data[0], null, 2));
        console.log('All categories in data:', [...new Set(data.map((p: any) => p.category))]);
        console.log('All statuses in data:', [...new Set(data.map((p: any) => p.status))]);
      }
      
    } catch (error) {
      console.error('Error fetching promises:', error);
      
      let errorMessage = 'Failed to fetch promises';
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as import('axios').AxiosError;
        if (axiosError.response) {
          // Server responded with error status
          errorMessage = `Server Error: ${axiosError.response.status} - ${
            typeof axiosError.response.data === 'object' && axiosError.response.data && 'message' in axiosError.response.data
              ? (axiosError.response.data as { message?: string }).message
              : axiosError.response.statusText
          }`;
        } else if (axiosError.request) {
          // Request was made but no response received
          errorMessage = 'Network Error: Unable to connect to server. Make sure your backend is running.';
        } else {
          // Something else happened
          errorMessage = `Request Error: ${axiosError.message}`;
        }
      } else {
        errorMessage = String(error);
      }
      
      setError(errorMessage);
      setPromises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Only navigate if not already on the tab
    if (tabName !== activeTab) {
      navigation.navigate(tabName as never);
    }
  };

  const filteredPromises = promises.filter((p: any) => {
    try {
      // Category filter - show all if "ALL" is selected, otherwise match exact category
      const matchCategory = selectedCategory === 'ALL' || (p.promiseCategory === selectedCategory);
      
      // Status filter - show all if "All" is selected, otherwise match exact status
      const matchStatus = selectedStatus === 'All' || (p.promiseStatus === selectedStatus);
      
      // Search filter - if search is empty, show all, otherwise check name and title
      const matchSearch = search.trim() === '' || 
        (p.promiseName && p.promiseName.toLowerCase().includes(search.toLowerCase())) ||
        (p.title && p.title.toLowerCase().includes(search.toLowerCase()));
      
      return matchCategory && matchStatus && matchSearch;
    } catch (err) {
      console.error('Error filtering promise:', err, p);
      return false;
    }
  });

  // Add debug logging to see what's happening
  console.log('Total promises:', promises.length);
  console.log('Selected category:', selectedCategory);
  console.log('Selected status:', selectedStatus);
  console.log('Search term:', search);
  console.log('Filtered promises:', filteredPromises.length);
  console.log('Sample promise:', promises[0]); // To see the structure of your data

  const renderPromiseCard = (p: any) => {
    try {
      return (
        <TouchableOpacity 
          key={p._id || p.id || Math.random()} 
          style={styles.card} 
          onPress={() => (navigation as any).navigate('PromiseDetail', { promise: p })}
        >
          <Image 
            source={
              p.politicianImage && typeof p.politicianImage === 'string' && p.politicianImage.startsWith('http')
                ? { uri: p.politicianImage }
                : require('../../../assets/candidate-placeholder.png')
            } 
            style={styles.avatar} 
          />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{p.ministerName || 'Unknown Politician'}</Text>
              <Text style={styles.role}>{p.ministryName || 'Unknown Role'}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(p.promiseStatus || 'pending').bg }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: getStatusColor(p.promiseStatus || 'pending').text }
              ]}>
                {p.promiseStatus || 'pending'}
              </Text>
            </View>
            <Text style={styles.cardTitle}>{p.promiseTitle || 'No Title Available'}</Text>
            {/* <Text style={styles.cardDesc} numberOfLines={3}>
              {p.promiseDetails || 'No description available'}
            </Text> */}
          </View>
        </TouchableOpacity>
      );
    } catch (err) {
      console.error('Error rendering promise card:', err, p);
      return null;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading promises...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPromises}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredPromises.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {promises.length === 0 ? 'No promises available' : 'No promises match your filters'}
          </Text>
        </View>
      );
    }

    return filteredPromises.map(renderPromiseCard).filter(Boolean);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Politicians Promises" />
      
      {/* Category Filter */}
      <View style={styles.categoryTabContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === cat && styles.categoryTabTextActive,
            ]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Status Filter */}
      <View style={styles.statusContainer}>
        {statuses.map(stat => (
          <TouchableOpacity
            key={stat}
            style={[
              styles.statusBtn,
              selectedStatus === stat && styles.statusBtnActive,
            ]}
            onPress={() => setSelectedStatus(stat)}
          >
            <Text style={[
              styles.statusText,
              selectedStatus === stat && styles.statusTextActive,
            ]}>{stat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search promises or politicians"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      {/* Promise Cards */}
      <ScrollView 
        style={styles.promisesScroll} 
        contentContainerStyle={styles.promisesContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
      
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  categoryTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#3B4899',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  statusBtnActive: {
    backgroundColor: '#1E293B',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  statusTextActive: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#1E293B',
  },
  promisesScroll: {
    flex: 1,
  },
  promisesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 70,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  cardHeader: {
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  role: {
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 4,
    paddingRight: 70, // Space for the status badge
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  customBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
    marginTop: 4,
  },
  navItemTextInactive: {
    color: '#64748B',
  },
});