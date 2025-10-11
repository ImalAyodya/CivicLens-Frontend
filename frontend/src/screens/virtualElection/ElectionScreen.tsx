import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BlueHeader from "../../components/BlueHeader";
import type { RootStackParamList } from "../../navigation/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use local API_URL constant - matches AddElectionScreen
const API_URL = "http://localhost:5000/api";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Backend schema interfaces
interface BackendCandidate {
  politician: {
    _id: string;
    name: string;
    image?: string;
    party: {
      _id: string;
      name: string;
      color?: string;
    };
  };
  votes: number;
}

interface BackendElection {
  _id: string;
  title: string;              // Backend uses 'title' not 'name'
  description?: string;
  startDate: string;
  endDate: string;
  candidates: BackendCandidate[];
  status: "upcoming" | "ongoing" | "completed";
  totalVotes: number;
}

interface PartyDetails {
  _id: string;
  fullName: string;
  abbreviation: string;
  logo?: string;
  color?: string;
  founder?: string;
}

export default function ElectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [elections, setElections] = useState<BackendElection[]>([]);
  const [activeElection, setActiveElection] = useState<BackendElection | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  // Store party details for each candidate by politicianId
  const [candidateParties, setCandidateParties] = useState<{ [politicianId: string]: PartyDetails }>({});

  useEffect(() => {
    const initializeData = async () => {
      await getCurrentUser(); // Fetch user from token first
      await fetchElections();
    };
    initializeData();
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        // Fetch current user details from backend using token
        const response = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData._id);
          console.log('Current User ID set to:', userData._id);
        } else {
          console.log('Failed to fetch user data');
        }
      } else {
        console.log('No token found - user not logged in');
      }
    } catch (err) {
      console.log('Error getting current user:', err);
    }
  };

  const fetchElections = async () => {
    try {
      setLoading(true);
      console.log('Fetching elections from:', `${API_URL}/virtualElections`);

      const response = await fetch(`${API_URL}/virtualElections`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Received elections:', data);
      
      if (response.ok) {
        setElections(data);
        // Set the first ongoing election as the current one, or first available
        const active = data.find((e: BackendElection) => e.status === "ongoing");
        setActiveElection(active || data[0] || null);
        // Fetch party details for all candidates in the active election
        const election = active || data[0];
        if (election) {
          fetchAllCandidateParties(election.candidates);
        }
      } else {
        console.error('API Error:', data);
        Alert.alert("Error", data.message || "Failed to fetch elections");
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      Alert.alert("Error", "Could not connect to server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch party details for all candidates in the election
  const fetchAllCandidateParties = async (candidates: BackendCandidate[]) => {
    const promises = candidates.map(async (candidate) => {
      const id = candidate.politician._id;
      if (!id) return;
      try {
        const res = await fetch(`${API_URL}/politicians/${id}/party`);
        if (res.ok) {
          const data = await res.json();
          if (data.party) {
            setCandidateParties(prev => ({ ...prev, [id]: data.party }));
          }
        }
      } catch (err) {
        // Ignore errors for individual candidates
      }
    });
    await Promise.all(promises);
  };

  const handleVote = async (candidateId: string) => {
    if (!currentUserId) {
      Alert.alert("Authentication Required", "Please log in to vote");
      return;
    }

    if (!authToken) {
      Alert.alert("Authentication Required", "Please log in to get an authentication token");
      return;
    }

    if (!activeElection) {
      Alert.alert("Error", "No active election");
      return;
    }

    try {
      setVotingLoading(candidateId);
      console.log('Casting vote:', { election: activeElection._id, candidate: candidateId, voterId: currentUserId });
      console.log('Using token:', authToken);
      
      const response = await fetch(`${API_URL}/virtualElections/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,  // Add Authorization header with token from AsyncStorage
        },
        body: JSON.stringify({
          election: activeElection._id,    // Backend expects 'election' not 'electionId'
          candidate: candidateId,          // Backend expects 'candidate' not 'candidateId'
          voterId: currentUserId,          // Backend expects 'voterId' - using real user ID from token
        }),
      });

      console.log('Vote response status:', response.status);
      const data = await response.json();
      console.log('Vote response data:', data);

      if (response.ok) {
        Alert.alert("Success", "Your vote has been recorded!");
        // Refresh elections to get updated vote counts
        fetchElections();
      } else {
        Alert.alert("Error", data.message || "Failed to record vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      Alert.alert("Error", "Could not connect to server. Please check your internet connection.");
    } finally {
      setVotingLoading(null);
    }
  };

  const calculateVoteStats = (candidate: BackendCandidate) => {
    // Backend stores votes directly in the candidate object
    const count = candidate.votes || 0;
    const totalVotes = activeElection?.totalVotes || 0;
    const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    
    return { count, percent: percent.toFixed(1) };
  };

  const getTotalVotes = () => {
    return activeElection?.totalVotes || 0;
  };

  const getTimeRemaining = () => {
    if (!activeElection) return "No active election";
    
    const endDate = new Date(activeElection.endDate);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Election ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Ends in ${days} day${days > 1 ? 's' : ''}`;
    return `Ends in ${hours} hour${hours > 1 ? 's' : ''}`;
  };

  // Get party color from party details or fallback
  const getPartyColor = (party: PartyDetails | undefined) => {
    if (party?.color) return party.color;
    return '#3B82F6';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <BlueHeader title="Virtual Election" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading elections...</Text>
        </View>
      </View>
    );
  }

  if (!activeElection) {
    return (
      <View style={styles.container}>
        <BlueHeader title="Virtual Election" onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active elections at the moment</Text>
          <Text style={styles.emptySubtext}>Check back later for new elections</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BlueHeader title="Virtual Election" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.voteNow}>Vote Now</Text>
          <Text style={styles.title}>{activeElection.title}</Text>
          {activeElection.description && (
            <Text style={styles.subtitle}>{activeElection.description}</Text>
          )}
          <View style={styles.countdown}>
            <Text style={styles.countdownText}>⏳ {getTimeRemaining()}</Text>
          </View>
        </View>

      {/* Candidate List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Candidate</Text>
        {activeElection.candidates.map((candidate) => {
          const stats = calculateVoteStats(candidate);
          const party = candidateParties[candidate.politician._id];
          const partyAbbr = party?.abbreviation || "IND";
          const partyColor = getPartyColor(party);
          const isVoting = votingLoading === candidate.politician._id;
          return (
            <View key={candidate.politician._id} style={styles.card}>
              <View style={styles.row}>
                <Image 
                  source={{ 
                    uri: candidate.politician.image || "https://randomuser.me/api/portraits/men/32.jpg" 
                  }} 
                  style={styles.avatar} 
                />
                <View style={styles.info}>
                  <View style={styles.row}>
                    <Text style={styles.name}>{candidate.politician.name}</Text>
                    <Text style={[styles.partyBadge, { backgroundColor: partyColor }]}> 
                      {partyAbbr}
                    </Text>
                  </View>
                  <Text style={styles.voteCount}>
                    {stats.count.toLocaleString()} votes • {stats.percent}%
                  </Text>
                </View>
                {party?.logo && (
                  <Image source={{ uri: party.logo }} style={{ width: 32, height: 32, marginLeft: 8, borderRadius: 6 }} />
                )}
              </View>
              <TouchableOpacity 
                style={[styles.voteBtn, { backgroundColor: partyColor }]}
                onPress={() => handleVote(candidate.politician._id)}
                disabled={isVoting}
              >
                {isVoting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.voteBtnText}>
                    Vote for {candidate.politician.name.split(" ")[0]}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

        {/* Footer Stats */}
        <View style={styles.statsBox}>
          <View>
            <Text style={styles.statNumber}>{getTotalVotes().toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{activeElection.candidates.length}</Text>
            <Text style={styles.statLabel}>Candidates</Text>
          </View>
        </View>
        <Text style={styles.updated}>📅 Last updated: Just now</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  voteNow: {
    fontSize: 16,
    color: "#6366F1",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  countdown: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  countdownText: {
    fontSize: 13,
    color: "#374151",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  partyBadge: {
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
    marginLeft: 6,
  },
  voteCount: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  voteBtn: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  voteBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  statLabel: {
    fontSize: 13,
    color: "#374151",
  },
  updated: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
});
