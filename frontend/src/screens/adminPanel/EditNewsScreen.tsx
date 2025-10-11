import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Switch,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "EditNews">;
type EditNewsRouteProp = RouteProp<RootStackParamList, "EditNews">;

const API_BASE_URL = "http://localhost:5000";

// News categories
const NEWS_CATEGORIES = [
  "Politics",
  "Economy",
  "Health",
  "Education",
  "Environment",
  "Technology",
  "International",
  "Local",
  "Opinion",
  "Election"
];

const EditNewsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditNewsRouteProp>();
  const { newsId } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    summary: "", // Add the summary field
    category: "Politics",
    author: "",
    source: "",
    imageUrl: "",
    isBreaking: false,
    isTrending: false
  });

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/news/${newsId}`);
        const newsData = response.data;
        
        setForm({
          title: newsData.title || "",
          subtitle: newsData.subtitle || "",
          content: newsData.content || "",
          summary: newsData.summary || "", // Add the summary field
          category: newsData.category || "Politics",
          author: newsData.author || "",
          source: newsData.source || "",
          imageUrl: newsData.imageUrl || "",
          isBreaking: newsData.isBreaking || false,
          isTrending: newsData.isTrending || false
        });
      } catch (error) {
        console.error("Failed to fetch news details:", error);
        Alert.alert("Error", "Failed to load news details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchNewsDetails();
  }, [newsId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8
      });

      if (!result.canceled) {
        setForm({ ...form, imageUrl: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "Title is required");
      return false;
    }
    if (!form.content.trim()) {
      Alert.alert("Error", "Content is required");
      return false;
    }
    if (!form.summary.trim()) { // Validate summary
      Alert.alert("Error", "Summary is required");
      return false;
    }
    if (!form.category) {
      Alert.alert("Error", "Category is required");
      return false;
    }
    if (!form.author.trim()) {
      Alert.alert("Error", "Author is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.put(`${API_BASE_URL}/api/news/${newsId}`, {
        title: form.title,
        subtitle: form.subtitle,
        content: form.content,
        summary: form.summary, // Include summary in the update
        category: form.category,
        author: form.author,
        source: form.source,
        imageUrl: form.imageUrl,
        isBreaking: form.isBreaking,
        isTrending: form.isTrending
      });

      Alert.alert(
        "Success",
        "News article updated successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Failed to update news article:", error);
      Alert.alert("Error", "Failed to update news article");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading news details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit News Article</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* Image Upload */}
          <Text style={styles.label}>Featured Image</Text>
          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {form.imageUrl ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: form.imageUrl }} style={styles.previewImage} />
                <Text style={styles.changeImageText}>Tap to change image</Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="image-outline" size={40} color="#CBD5E1" />
                <Text style={styles.uploadText}>Tap to upload featured image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder="Enter news title"
            placeholderTextColor="#94A3B8"
          />

          {/* Subtitle */}
          <Text style={styles.label}>Subtitle</Text>
          <TextInput
            style={styles.input}
            value={form.subtitle}
            onChangeText={(text) => setForm({ ...form, subtitle: text })}
            placeholder="Enter subtitle (optional)"
            placeholderTextColor="#94A3B8"
          />

          {/* Summary - Add the new summary field */}
          <Text style={styles.label}>Summary *</Text>
          <TextInput
            style={[styles.input, styles.summaryArea]}
            value={form.summary}
            onChangeText={(text) => setForm({ ...form, summary: text })}
            placeholder="Enter a brief summary of the article"
            placeholderTextColor="#94A3B8"
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Content */}
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.content}
            onChangeText={(text) => setForm({ ...form, content: text })}
            placeholder="Enter news content"
            placeholderTextColor="#94A3B8"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />

          {/* Category */}
          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.category}
              onValueChange={(value) => setForm({ ...form, category: value })}
              style={styles.picker}
            >
              {NEWS_CATEGORIES.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>

          {/* Author */}
          <Text style={styles.label}>Author *</Text>
          <TextInput
            style={styles.input}
            value={form.author}
            onChangeText={(text) => setForm({ ...form, author: text })}
            placeholder="Enter author name"
            placeholderTextColor="#94A3B8"
          />

          {/* Source */}
          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.input}
            value={form.source}
            onChangeText={(text) => setForm({ ...form, source: text })}
            placeholder="Enter news source (optional)"
            placeholderTextColor="#94A3B8"
          />

          {/* Special Tags */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Breaking News</Text>
            <Switch
              trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
              thumbColor={form.isBreaking ? "#2563EB" : "#f4f3f4"}
              ios_backgroundColor="#CBD5E1"
              onValueChange={() => setForm({ ...form, isBreaking: !form.isBreaking })}
              value={form.isBreaking}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Trending News</Text>
            <Switch
              trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
              thumbColor={form.isTrending ? "#2563EB" : "#f4f3f4"}
              ios_backgroundColor="#CBD5E1"
              onValueChange={() => setForm({ ...form, isTrending: !form.isTrending })}
              value={form.isTrending}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={loading ? "Updating news article, please wait" : "Update news article"}
          >
            {loading ? (
              <Ionicons name="sync" size={20} color="white" style={[styles.buttonIcon, { opacity: 0.7 }]} />
            ) : (
              <Ionicons name="save-outline" size={20} color="white" style={styles.buttonIcon} />
            )}
            <Text style={styles.buttonText}>
              {loading ? "Updating News Article..." : "Update News Article"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B"
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
  placeholder: {
    width: 40
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 16,
    color: "#334155"
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1E293B"
  },
  summaryArea: {
    height: 80,
    textAlignVertical: "top"
  },
  textArea: {
    height: 150,
    textAlignVertical: "top"
  },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 8
  },
  picker: {
    height: 50
  },
  imageUploadContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center"
  },
  uploadText: {
    color: "#64748B",
    marginTop: 12,
    fontSize: 16
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    position: "relative"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  },
  changeImageText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#FFF",
    textAlign: "center",
    padding: 8,
    fontSize: 14
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9"
  },
  switchLabel: {
    fontSize: 16,
    color: "#334155"
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 24
  },
  btnDisabled: {
    backgroundColor: "#93C5FD"
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default EditNewsScreen;