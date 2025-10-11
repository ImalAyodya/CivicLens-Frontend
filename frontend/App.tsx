import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ComparisonScreen from './src/screens/ComparisonScreen';
import ComparisonResultScreen from './src/screens/ComparisonResultScreen';
import PoliticalQuizScreen from './src/screens/PoliticalQuizScreen';
import QuizQuestionScreen from './src/screens/QuizQuestionScreen';
import QuizResultScreen from './src/screens/QuizResultScreen';
import PoliBotScreen from './src/screens/PoliBotScreen';
import PoliBotChatScreen from './src/screens/PoliBotChatScreen';

// Import news screens
import NewsFeedScreen from './src/screens/news/NewsFeedScreen';
import NewsDetailScreen from './src/screens/news/NewsDetailScreen';
import NewsSearchScreen from './src/screens/news/NewsSearchScreen';
import GrowthNewsDetailScreen from './src/screens/promises_&_growth/GrowthNewsDetailScreen';

// Import other screens
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import ElectionCountdownScreen from './src/screens/elections/ElectionCountdownScreen';
import PastElectionsScreen from './src/screens/elections/PastElectionsScreen';
import ElectionDetailScreen from './src/screens/elections/ElectionDetailScreen';
import PoliticianDirectoryScreen from './src/screens/politicianDirectory/DirectoryScreen';
import PoliticianProfileScreen from './src/screens/politicianProfile/ProfileScreen';
import PoliticianPromisesScreen from './src/screens/promises_&_growth/PoliticianPromisesScreen';
import MinistryPerformanceScreen from './src/screens/promises_&_growth/MinistryPerformanceScreen';
import PromiseDetailScreen from './src/screens/promises_&_growth/PromiseDetailScreen';

// Create the navigator with the correct type
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
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Comparison" component={ComparisonScreen} />
        <Stack.Screen name="ComparisonResult" component={ComparisonResultScreen} />
        <Stack.Screen name="PoliticalQuiz" component={PoliticalQuizScreen} />
        <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="PoliBot" component={PoliBotScreen} />
        <Stack.Screen name="PoliBotChat" component={PoliBotChatScreen} />
        
        {/* News screens */}
        <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
        <Stack.Screen name="Search" component={NewsSearchScreen} />
        <Stack.Screen name="GrowthNewsDetail" component={GrowthNewsDetailScreen} />
        
        {/* Other screens */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ElectionCountdown" component={ElectionCountdownScreen} />
        <Stack.Screen name="PastElections" component={PastElectionsScreen} />
        <Stack.Screen name="ElectionDetail" component={ElectionDetailScreen} />
        <Stack.Screen name="PoliticianDirectory" component={PoliticianDirectoryScreen} />
        <Stack.Screen name="PoliticianProfile" component={PoliticianProfileScreen} />
        <Stack.Screen name="PoliticianPromises" component={PoliticianPromisesScreen} />
        <Stack.Screen name="MinistryPerformance" component={MinistryPerformanceScreen} />
        <Stack.Screen name="PromiseDetail" component={PromiseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
