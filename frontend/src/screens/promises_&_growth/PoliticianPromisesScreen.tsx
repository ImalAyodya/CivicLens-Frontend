import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';

const categories = ['ALL', 'Education', 'Health', 'Economy', 'Others'];
const statuses = ['All', 'Completed', 'Pending', 'Broken'];

const promisesData = [
  {
    id: 1,
    name: 'Harini Amarasuriya',
    role: 'Minister of Education',
    avatar: require('../../../assets/harini_amarasuriya.jpg'),
    status: 'Pending',
    title: 'Pledge for educational reforms',
    description: 'Prime Minister pledges immediate action on educational reforms and fund collection practices',
    category: 'Education',
  },
  {
    id: 2,
    name: 'Dr. Nalinda Jayathissa',
    role: 'Health & Mass Media Minister',
    avatar: require('../../../assets/nalinda_Jayathissa.jpg'),
    status: 'Completed',
    title: 'Cost-cutting measures',
    description: 'He said he would give up his ministerial salary and parliamentary allowances; give up luxury vehicles; halve fuel allocations for ministers; stop using official residences allocated for ministers.',
    category: 'Health',
  },
  {
    id: 3,
    name: 'Anura Kumara Dissanayake',
    role: 'Sri Lankan President & Finance Minister',
    avatar: require('../../../assets/anura_kumara.jpg'),
    status: 'Pending',
    title: '5% Economic Growth Target',
    description: 'President Anura Kumara Dissanayake (also Finance Minister) promised that the Sri Lankan economy will grow by about 5% in 2025.',
    category: 'Economy',
  },
  {
    id: 4,
    name: 'Aruna Ranwala',
    role: 'Parliament Minister',
    avatar: require('../../../assets/candidate-placeholder.png'),
    status: 'Broken',
    title: 'Renovate all major highways',
    description: 'Main infrastructure project to repair and upgrade all national highways to improve transportation and safety.',
    category: 'Others',
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: '#D1FAE5', text: '#059669' },
  Pending: { bg: '#FEF3C7', text: '#B45309' },
  Broken: { bg: '#FEE2E2', text: '#B91C1C' },
};

const getStatusColor = (status: string) =>
  statusColors[status] || { bg: '#E5E7EB', text: '#6B7280' };

export default function PoliticianPromisesScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('PoliticianPromises');

  useEffect(() => {
    if (isFocused) setActiveTab('PoliticianPromises');
  }, [isFocused]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName !== 'PoliticianPromises') {
      navigation.navigate(tabName as never);
    }
  };

  const filteredPromises = promisesData.filter(p => {
    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header must be at the top and not inside ScrollView */}
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
        {filteredPromises.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => (navigation as any).navigate('PromiseDetail', { promise: p })}>
            <Image source={p.avatar} style={styles.avatar} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.role}>{p.role}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(p.status).bg }
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: getStatusColor(p.status).text }
                ]}>
                  {p.status}
                </Text>
              </View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardDesc}>{p.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Use imported BottomNavBar */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
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