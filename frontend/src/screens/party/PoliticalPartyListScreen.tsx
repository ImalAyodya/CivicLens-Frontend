import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, RefreshControl, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PartyList' | 'PoliticalPartyList'>;

type Party = {
  _id: string;
  abbreviation: string;
  color: string;
  fullName: string;
  logo?: string;
  founded?: string;
  founder?: string;
  status: string;
};
const API_URL = "https://civiclens-backend-production-2c6d.up.railway.app/api";

//const API_URL = "http://localhost:5000/api/parties";

const PartyLogo = ({ party }: { party: Party }) => {
  const [imageError, setImageError] = useState(false);
  React.useEffect(() => { setImageError(false); }, [party.logo]);
  return (
    <View style={[styles.logo, { backgroundColor: (party.logo && !imageError) ? 'transparent' : party.color }]}> 
      {party.logo && !imageError ? (
        <Image 
          source={{ uri: party.logo }}
          style={styles.logoImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <Text style={styles.logoText}>{party.abbreviation}</Text>
      )}
    </View>
  );
};

const PoliticalPartyListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [parties, setParties] = useState<Party[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const fetchParties = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
  const res = await axios.get(`${API_URL}/parties`);
      setParties(res.data);
      setBackendStatus('connected');
    } catch (err: any) {
      setBackendStatus('disconnected');
      if (__DEV__) {
        // Use mock data in dev
        setParties([
          { _id: '1', fullName: 'United National Party', abbreviation: 'UNP', color: '#00A859', founded: '1946', founder: 'D.S. Senanayake', status: 'Active' },
          { _id: '2', fullName: 'Sri Lanka Podujana Peramuna', abbreviation: 'SLPP', color: '#8B0000', founded: '2016', founder: 'Mahinda Rajapaksa', status: 'Active' },
          { _id: '3', fullName: 'Samagi Jana Balawegaya', abbreviation: 'SJB', color: '#FF6B35', founded: '2020', founder: 'Sajith Premadasa', status: 'Active' },
          { _id: '4', fullName: 'Janatha Vimukthi Peramuna', abbreviation: 'JVP', color: '#FF0000', founded: '1965', founder: 'Rohana Wijeweera', status: 'Active' },
          { _id: '5', fullName: 'Tamil National Alliance', abbreviation: 'TNA', color: '#FFD700', founded: '2001', founder: 'R. Sampanthan', status: 'Inactive' }
        ]);
      } else {
        Alert.alert("Connection Error", "Unable to fetch parties. Please check your internet connection and try again.");
      }
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchParties();
  };

  useEffect(() => { fetchParties(true); }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => { fetchParties(); });
    return unsubscribe;
  }, [navigation]);

  const filteredParties = parties.filter(p => {
    if (filter !== "All" && p.status !== filter) return false;
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderParty = ({ item }: { item: Party }) => (
    <View style={styles.partyCard}>
      <PartyLogo party={item} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.founder}>👤 Founder: {item.founder || "N/A"}</Text>
        <Text style={[
          styles.status,
          item.status === "Active" ? styles.active : 
          item.status === "Pending" ? styles.pending : styles.inactive]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      {/* Top Blue Header Bar */}
      <View style={[styles.header, { backgroundColor: '#2563EB', borderBottomColor: '#2563EB' }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>All Political Parties</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {backendStatus === 'disconnected' && __DEV__ && (
          <View style={styles.statusBanner}>
            <Ionicons name="warning" size={16} color="#ff6b35" />
            <Text style={styles.statusText}>Backend disconnected - Using mock data</Text>
          </View>
        )}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search parties..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.filterRow}>
          {["All", "Active", "Pending", "Inactive"].map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              style={[
                styles.filterBtn,
                filter === f && styles.filterSelected
              ]}
            >
              <Text style={[
                styles.filterText,
                filter === f && styles.filterSelectedText
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Total Parties: {parties.length} | Showing: {filteredParties.length}
          </Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading parties...</Text>
          </View>
        ) : filteredParties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="flag-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {search ? "No parties match your search" : "No political parties found"}
            </Text>
            <Text style={styles.emptySubtext}>
              {search ? "Try adjusting your search terms" : "No parties available"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredParties}
            keyExtractor={(item) => item._id}
            renderItem={renderParty}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: "#2563EB",
    borderBottomWidth: 1,
    borderBottomColor: "#2563EB",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  placeholder: { width: 40 },
  content: { flex: 1, padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, padding: 12, fontSize: 16 },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', elevation: 1 },
  filterSelected: { backgroundColor: "#007bff", elevation: 2 },
  filterText: { color: "#666", fontWeight: '500' },
  filterSelectedText: { color: "#fff", fontWeight: 'bold' },
  statsContainer: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16, elevation: 1 },
  statsText: { fontSize: 14, color: '#666', fontWeight: '500' },
  partyCard: { flexDirection: "row", backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 12, alignItems: "center", elevation: 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  logo: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 16 },
  logoText: { color: "white", fontWeight: "bold", fontSize: 14 },
  logoImage: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16, color: '#333', marginBottom: 4 },
  founder: { fontSize: 12, color: "#666", fontStyle: 'italic', marginBottom: 6 },
  status: { fontSize: 12, fontWeight: "600", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  active: { color: "white", backgroundColor: "#28a745" },
  pending: { color: "white", backgroundColor: "#ffc107" },
  inactive: { color: "white", backgroundColor: "#dc3545" },
  statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#ff6b35' },
  statusText: { marginLeft: 8, fontSize: 14, color: '#856404', flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
});

export default PoliticalPartyListScreen;
