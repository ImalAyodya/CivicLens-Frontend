import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import axios from "axios";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "ElectionList">;

type ElectionItem = {
  _id: string;
  title: string;
  electionType: string;
  date: string;
  isUpcoming: boolean;
  status: string;
};

const API_BASE_URL = "http://localhost:5000";

const ElectionListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [elections, setElections] = useState<ElectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add this helper function for safer navigation
  const safeNavigate = (screenName: keyof RootStackParamList, params?: any) => {
    try {
      if (navigation) {
        navigation.navigate("AddElection");
      } else {
        console.warn('Navigation is not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        navigation?.dispatch(
          CommonActions.navigate({
            name: screenName,
            params
          })
        );
      } catch (fallbackError) {
        console.error('Navigation fallback also failed:', fallbackError);
      }
    }
  };

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/elections`);
      
      // Extract the actual elections data from the response
      // The API returns { success: true, count: X, data: [...election items] }
      const electionsData = response.data.data || response.data;
      
      console.log("Fetched elections:", electionsData);
      
      // Make sure we're setting an array
      setElections(Array.isArray(electionsData) ? electionsData : []);
    } catch (error) {
      console.error("Failed to fetch elections:", error);
      Alert.alert("Error", "Failed to load elections");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchElections();
  };

  const handleDelete = (id: string) => {
    console.log("Delete button pressed for ID:", id);
    
    setTimeout(() => {
      Alert.alert(
        "Delete Election",
        "Are you sure you want to delete this election?",
        [
          { 
            text: "Cancel", 
            style: "cancel",
            onPress: () => console.log("Delete cancelled")
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                console.log(`Attempting to delete election with ID: ${id}`);
                const deleteUrl = `${API_BASE_URL}/api/elections/${id}`;
                console.log(`Delete URL: ${deleteUrl}`);
                
                const response = await axios.delete(deleteUrl);
                
                console.log("Delete response:", response.data);
                
                setElections(prevElections => prevElections.filter(item => item._id !== id));
                
                setTimeout(() => {
                  Alert.alert("Success", "Election deleted successfully");
                }, 300);
                
              } catch (error: any) {
                console.error("Failed to delete election:", error);
                
                let errorMessage = "Failed to delete election";
                
                if (error.response) {
                  console.error("Response error data:", error.response.data);
                  console.error("Response error status:", error.response.status);
                  errorMessage = error.response.data?.message || error.response.data?.error || "Server error";
                } else if (error.request) {
                  console.error("No response received:", error.request);
                  errorMessage = "Server did not respond. Check your connection.";
                } else {
                  errorMessage = error.message || errorMessage;
                }
                
                setTimeout(() => {
                  Alert.alert("Error", errorMessage);
                }, 300);
              }
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  // Format a date string to a human-readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Determine badge color based on election status
  const getStatusBadgeStyle = (status: string, isUpcoming: boolean) => {
    if (isUpcoming) return styles.upcomingBadge;
    
    switch (status.toLowerCase()) {
      case 'completed':
        return styles.completedBadge;
      case 'cancelled':
        return styles.cancelledBadge;
      case 'postponed':
        return styles.postponedBadge;
      default:
        return styles.defaultBadge;
    }
  };

  const renderElectionItem = ({ item }: { item: ElectionItem }) => {
    return (
      <View style={styles.electionItem}>
        <View style={styles.electionContent}>
          <View style={styles.titleRow}>
            <Text style={styles.electionTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.badgesContainer}>
              <View style={[styles.badge, getStatusBadgeStyle(item.status, item.isUpcoming)]}>
                <Text style={styles.badgeText}>
                  {item.isUpcoming ? "Upcoming" : item.status}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.electionDetails}>
            <Text style={styles.electionCategory}>{item.electionType}</Text>
            <Text style={styles.electionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => safeNavigate("EditElection", { electionId: item._id })}
            accessibilityLabel="Edit election"
          >
            <Ionicons name="create-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              console.log("Delete button touched for election:", item._id);
              handleDelete(item._id);
            }}
            activeOpacity={0.7}
            accessibilityLabel="Delete election"
          >
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            try {
              navigation.goBack();
            } catch (error) {
              console.error("Navigation error on back:", error);
              safeNavigate("Home");
            }
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Elections Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => safeNavigate("AddElection")}
        >
          <Ionicons name="add" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Election List */}
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={elections}
          keyExtractor={(item) => item._id}
          renderItem={renderElectionItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No elections found</Text>
              <TouchableOpacity 
                style={styles.addElectionButton}
                onPress={() => safeNavigate("AddElection")}
              >
                <Text style={styles.addElectionText}>Add Election</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  addButton: {
    padding: 8
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listContent: {
    padding: 16,
    paddingBottom: 80
  },
  electionItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  electionContent: {
    flex: 1
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  electionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginBottom: 8
  },
  electionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8
  },
  electionCategory: {
    fontSize: 14,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  electionDate: {
    fontSize: 13,
    color: "#94A3B8"
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    marginRight: 8
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2"
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 6
  },
  upcomingBadge: {
    backgroundColor: "#DBEAFE"
  },
  completedBadge: {
    backgroundColor: "#DCFCE7"
  },
  cancelledBadge: {
    backgroundColor: "#FEE2E2"
  },
  postponedBadge: {
    backgroundColor: "#FEF3C7"
  },
  defaultBadge: {
    backgroundColor: "#E2E8F0"
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 12,
    marginBottom: 20
  },
  addElectionButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  addElectionText: {
    color: "#FFF",
    fontWeight: "600"
  }
});

export default ElectionListScreen;