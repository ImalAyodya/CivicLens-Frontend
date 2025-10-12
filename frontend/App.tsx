import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewsFeedScreen from './src/screens/news/NewsFeedScreen';
import NewsDetailScreen from './src/screens/news/NewsDetailScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import ElectionCountdownScreen from './src/screens/elections/ElectionCountdownScreen';
import PastElectionsScreen from './src/screens/elections/PastElectionsScreen';
import DirectoryScreen from './src/screens/politicianDirectory/DirectoryScreen';
import ProfileScreen from './src/screens/politicianProfile/ProfileScreen';
import AdminPanelScreen from './src/screens/adminPanel/AdminPanelScreen';
import HierarchyScreen from './src/screens/politicianHierarchy/HierarchyScreen';
import HierarchyPoliticianList from './src/screens/politicianHierarchy/HierarchyPoliticianList';
import AddPartyScreen from './src/screens/adminPanel/AddPartyScreen';
import PartyListScreen from './src/screens/adminPanel/PartyListScreen';
import PoliticianListScreen from './src/screens/adminPanel/PoliticianListScreen';
import AddPoliticianForm from './src/screens/adminPanel/AddPoliticianForm';
import type { RootStackParamList } from './src/navigation/types';
import RoleListScreen from './src/screens/adminPanel/RoleListScreen';
import AddRoleScreen from './src/screens/adminPanel/AddRoleScreen';
import LevelListScreen from './src/screens/adminPanel/LevelListScreen';
import AddLevelScreen from './src/screens/adminPanel/AddLevelScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetailScreen} 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal'
          }}
        />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ElectionCountdown" component={ElectionCountdownScreen} />
        <Stack.Screen name="PastElections" component={PastElectionsScreen} />
        <Stack.Screen name="DirectoryScreen" component={DirectoryScreen} />
        <Stack.Screen name="PoliticianProfile" component={ProfileScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        <Stack.Screen name="AddParty" component={AddPartyScreen} />
        <Stack.Screen name="PartyList" component={PartyListScreen} />
        <Stack.Screen name="PoliticianList" component={PoliticianListScreen} />
        <Stack.Screen name="AddPoliticianForm" component={AddPoliticianForm} />
        <Stack.Screen name="RoleList" component={RoleListScreen} />
        <Stack.Screen name="AddRole" component={AddRoleScreen} />
        <Stack.Screen name="Hierarchy" component={HierarchyScreen} />
        <Stack.Screen name="HierarchyPoliticianList" component={HierarchyPoliticianList} />
        <Stack.Screen name="LevelList" component={LevelListScreen} />
        <Stack.Screen name="AddLevel" component={AddLevelScreen} />

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
