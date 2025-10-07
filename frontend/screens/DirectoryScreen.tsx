import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import PoliticianCard from "../components/PoliticianCard";
import SearchBar from "../components/SearchBar";
import { politicians } from "../constants/dummyData";
import { RootTabParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type DirectoryNavProp = NativeStackNavigationProp<RootTabParamList, "Directory">;


const DirectoryScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
   const navigation = useNavigation<DirectoryNavProp>();

  const filteredData = politicians.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.party.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
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
            onPress={() =>
              navigation.navigate("PoliticianProfile", { id: item.id })
            }
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
  listContent: {
    paddingBottom: 20,
  },
});

export default DirectoryScreen;
// import React, { useState } from "react";
// import { View, FlatList, StyleSheet } from "react-native";
// import PoliticianCard from "../components/PoliticianCard";
// import SearchBar from "../components/SearchBar";
// import { politicians } from "../constants/dummyData";

// const DirectoryScreen: React.FC = () => {
//   const [searchText, setSearchText] = useState("");

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
//           />
//         )}
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
// });

// export default DirectoryScreen;
