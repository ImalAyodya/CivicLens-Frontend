import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DirectoryScreen from '../screens/politicianDirectory/DirectoryScreen';
import NewsFeedScreen from '../screens/news/NewsFeedScreen';
import HierarchyScreen from '../../screens/HierarchyScreen';
import AdminScreen from '../../screens/AdminScreen';
import ProfileScreen from '../screens/politicianProfile/ProfileScreen';

export type RootTabParamList = {
  Directory: undefined;
  Hierarchy: undefined;
  Admin: undefined;
  Profile: undefined;
  Home: undefined;
  NewsFeed: undefined;
  PoliticianProfile: { id: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#2563eb",
      tabBarInactiveTintColor: "gray",
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "list";
        if (route.name === "Directory") iconName = "list";
        else if (route.name === "Hierarchy") iconName = "git-branch";
        else if (route.name === "Admin") iconName = "settings";
        else if (route.name === "Profile") iconName = "person";
        else if (route.name === "Home") iconName = "home";
        else if (route.name === "NewsFeed") iconName = "newspaper";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Directory" component={DirectoryScreen} />
    <Tab.Screen name="NewsFeed" component={NewsFeedScreen} />
    <Tab.Screen name="Hierarchy" component={HierarchyScreen} />
    <Tab.Screen name="Admin" component={AdminScreen} />
    {/* Hidden profile screen */}
    <Tab.Screen
      name="PoliticianProfile"
      component={ProfileScreen}
      options={{
        tabBarButton: () => null,
        tabBarStyle: { display: "none" },
      }}
    />
  </Tab.Navigator>
);

export default MainTabNavigator;