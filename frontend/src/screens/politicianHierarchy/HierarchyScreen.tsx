import React from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HierarchyCard from "../../components/politicianHierarchy/HierarchyCard";

const HierarchyScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Political Hierarchy</Text>
        <Ionicons name="ellipsis-vertical" size={22} color="#555" />
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search politicians..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {["All Levels", "By Party", "By Region", "Nation"].map((tab, index) => (
          <TouchableOpacity key={index} style={[styles.filterChip, index === 0 && styles.activeFilter]}>
            <Text style={[styles.filterText, index === 0 && styles.activeFilterText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hierarchy List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        <HierarchyCard
          title="President"
          name="Ranil Wickremesinghe"
          party="UNP"
          color="#0056FF"
          icon="crop-outline"
          highlight
        />
        <HierarchyCard
          title="Prime Minister"
          name="Dinesh Gunawardena"
          party="SLPP"
          color="#fff"
          icon="person-outline"
        />
        <HierarchyCard
          title="Cabinet Ministers"
          name="24 Ministers"
          icon="people-outline"
        />
        <HierarchyCard
          title="Members of Parliament"
          name="225 MPs"
          icon="business-outline"
        />
        <HierarchyCard
          title="Provincial Councils"
          name="9 Provinces"
          icon="map-outline"
        />
        <HierarchyCard
          title="Local Authorities"
          name="340+ Councils"
          icon="home-outline"
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {(["home", "git-network", "list", "person-circle"] as const).map((icon, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Ionicons name={icon} size={24} color={index === 1 ? "#0056FF" : "#aaa"} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HierarchyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  searchInput: { marginLeft: 8, flex: 1 },
  filterContainer: { marginVertical: 15, paddingHorizontal: 20 },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f3f3f3",
    marginRight: 10,
  },
  filterText: { fontSize: 13, color: "#666" },
  activeFilter: { backgroundColor: "#0056FF" },
  activeFilterText: { color: "#fff" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 80 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
});
