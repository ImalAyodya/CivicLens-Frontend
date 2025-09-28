import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Screens
import DirectoryScreen from "../screens/DirectoryScreen";
import HierarchyScreen from "../screens/HierarchyScreen";
import AdminScreen from "../screens/AdminScreen";
import ProfileScreen from "../screens/ProfileScreen";

// ✅ Route types
export type RootTabParamList = {
  Directory: undefined;
  Hierarchy: undefined;
  Admin: undefined;
  Profile: undefined;
  PoliticianProfile: { id: string }; // <-- new screen with param
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#2563eb", // blue
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "list";
            if (route.name === "Directory") iconName = "list";
            else if (route.name === "Hierarchy") iconName = "git-branch";
            else if (route.name === "Admin") iconName = "settings";
            else if (route.name === "Profile") iconName = "person";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Directory" component={DirectoryScreen} />
        <Tab.Screen name="Hierarchy" component={HierarchyScreen} />
        <Tab.Screen name="Admin" component={AdminScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />

        {/* ✅ Hidden detail screen (no tab button) */}
        <Tab.Screen
          name="PoliticianProfile"
          component={ProfileScreen}
          options={{
            tabBarButton: () => null, // hides from tab bar
            tabBarStyle: { display: "none" }, // hides tab bar when open
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import DirectoryScreen from "../screens/DirectoryScreen";
// import HierarchyScreen from "../screens/HierarchyScreen";
// import AdminScreen from "../screens/AdminScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import { Ionicons } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator();

// const AppNavigator: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color, size }) => {
//             let iconName: keyof typeof Ionicons.glyphMap = "list";
//             if (route.name === "Directory") iconName = "list";
//             else if (route.name === "Hierarchy") iconName = "git-branch";
//             else if (route.name === "Admin") iconName = "settings";
//             else if (route.name === "Profile") iconName = "person";
//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//         })}
//       >
//         <Tab.Screen name="Directory" component={DirectoryScreen} />
//         <Tab.Screen name="Hierarchy" component={HierarchyScreen} />
//         <Tab.Screen name="Admin" component={AdminScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
