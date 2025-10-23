import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "NewsList">;

type NewsItem = {
  _id: string;
  title: string;
  category: string;
  publicationDate: string;
  date: string;
  createdAt: string;
  isBreaking: boolean;
  isTrending: boolean;
};

const API_BASE_URL = "http://localhost:5000";

const NewsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/news`);
      
      // Extract the actual news data from the response
      // The API returns { success: true, count: X, data: [...news items] }
      const newsData = response.data.data || response.data;
      
      console.log("Fetched news articles:", newsData);
      
      // Make sure we're setting an array
      setNews(Array.isArray(newsData) ? newsData : []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      Alert.alert("Error", "Failed to load news articles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Replace the existing handleDelete function with this implementation
  const handleDelete = (id: string) => {
    // First, log to confirm this function is being called
    console.log("Delete button pressed for ID:", id);
    
    // Use setTimeout to ensure Alert isn't blocked by other UI operations
    setTimeout(() => {
      Alert.alert(
        "Delete News Article",
        "Are you sure you want to delete this news article?",
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
                console.log(`Attempting to delete news with ID: ${id}`);
                const deleteUrl = `${API_BASE_URL}/api/news/${id}`;
                console.log(`Delete URL: ${deleteUrl}`);
                
                // Add an authorization header if needed (in case auth is required)
                const response = await axios.delete(deleteUrl);
                
                console.log("Delete response:", response.data);
                
                // Update the UI by removing the deleted item
                setNews(prevNews => prevNews.filter(item => item._id !== id));
                
                // Show success alert
                setTimeout(() => {
                  Alert.alert("Success", "News article deleted successfully");
                }, 300);
                
              } catch (error: any) {
                console.error("Failed to delete news:", error);
                
                let errorMessage = "Failed to delete news article";
                
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
                
                // Show error alert with delay to prevent potential conflicts
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

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    // Format date to be more readable - use whatever date field is available
    const dateValue = item.publicationDate || item.date || item.createdAt;
    const date = dateValue ? new Date(dateValue) : new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    return (
      <View style={styles.newsItem}>
        <View style={styles.newsContent}>
          <View style={styles.titleRow}>
            <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.badgesContainer}>
              {item.isBreaking && (
                <View style={[styles.badge, styles.breakingBadge]}>
                  <Text style={styles.badgeText}>Breaking</Text>
                </View>
              )}
              {item.isTrending && (
                <View style={[styles.badge, styles.trendingBadge]}>
                  <Text style={styles.badgeText}>Trending</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.newsDetails}>
            <Text style={styles.newsCategory}>{item.category}</Text>
            <Text style={styles.newsDate}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditNews", { newsId: item._id })}
            accessibilityLabel="Edit news article"
          >
            <Ionicons name="create-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              console.log("Delete button touched for item:", item._id);
              handleDelete(item._id);
            }}
            activeOpacity={0.7} // Add this to provide better touch feedback
            accessibilityLabel="Delete news article"
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddNews")}
        >
          <Ionicons name="add" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* News List */}
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item._id}
          renderItem={renderNewsItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No news articles found</Text>
              <TouchableOpacity 
                style={styles.addNewsButton}
                onPress={() => navigation.navigate("AddNews")}
              >
                <Text style={styles.addNewsText}>Add News Article</Text>
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
  newsItem: {
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
  newsContent: {
    flex: 1
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginBottom: 8
  },
  newsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8
  },
  newsCategory: {
    fontSize: 14,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  newsDate: {
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
  breakingBadge: {
    backgroundColor: "#FFEDD5"
  },
  trendingBadge: {
    backgroundColor: "#E0F2FE"
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
  addNewsButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  addNewsText: {
    color: "#FFF",
    fontWeight: "600"
  }
});

export default NewsListScreen;