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
import VoterEducationScreen from './src/screens/elections/VoterEducationScreen';
import ElectionLawsScreen from './src/screens/elections/ElectionLawsScreen';
import type { RootStackParamList } from './src/navigation/types';

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
        <Stack.Screen name="VoterEducation" component={VoterEducationScreen} />
        <Stack.Screen name="ElectionLaws" component={ElectionLawsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}