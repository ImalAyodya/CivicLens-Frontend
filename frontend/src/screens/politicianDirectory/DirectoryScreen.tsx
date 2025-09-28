import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PoliticianCard from "../../components/politicianDirectory/PoliticianCard";
import SearchBar from "../../components/politicianDirectory/SearchBar";
import { politicians } from "../../constants/dummyData";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

// Use the correct navigation type with access to the PoliticianProfile route
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DirectoryScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const filteredData = politicians.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.party.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Politicians Directory</Text>
      </View>
      
      <SearchBar value={searchText} onChangeText={setSearchText} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PoliticianCard
            name={item.name}
            party={item.party}
            role={item.role}
            image={item.image}
            partyColor={item.partyColor}
            fullWidth={true}
            onPress={() => navigation.navigate("PoliticianProfile", { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default DirectoryScreen;
// import React, { useState } from "react";
// import { View, FlatList, StyleSheet } from "react-native";
// import PoliticianCard from "../../components/politicianDirectory/PoliticianCard";
// import SearchBar from "../../components/politicianDirectory/SearchBar";
// import { politicians } from "../../constants/dummyData";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import type { RootStackParamList } from "../../navigation/types";

// // Use the correct navigation type with access to the PoliticianProfile route
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const DirectoryScreen: React.FC = () => {
//   const [searchText, setSearchText] = useState("");
//   const navigation = useNavigation<NavigationProp>();

//   const filteredData = politicians.filter(
//     (item) =>
//       item.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.party.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.role.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <SearchBar value={searchText} onChangeText={setSearchText} />
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <PoliticianCard
//             name={item.name}
//             party={item.party}
//             role={item.role}
//             image={item.image}
//             partyColor={item.partyColor}
//             fullWidth={true}
//             onPress={() => navigation.navigate("PoliticianProfile", { id: item.id })}
//           />
//         )}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// export default DirectoryScreen;