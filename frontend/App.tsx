
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import LoginScreen from './src/screens/common/LoginScreen';
import SignUpScreen from './src/screens/common/SignUpScreen';
import HomeScreen from './src/screens/common/HomeScreen';
import DashboardScreen from './src/screens/PerformanceAndComparrison/DashboardScreen';
import ComparisonScreen from './src/screens/PerformanceAndComparrison/ComparisonScreen';
import ComparisonResultScreen from './src/screens/PerformanceAndComparrison/ComparisonResultScreen';
import PoliticalQuizScreen from './src/screens/politicalQuiz/PoliticalQuizScreen';
import QuizQuestionScreen from './src/screens/politicalQuiz/QuizQuestionScreen';
import QuizResultScreen from './src/screens/politicalQuiz/QuizResultScreen';
import PoliBotScreen from './src/screens/polibot/PoliBotScreen';
import PoliBotChatScreen from './src/screens/polibot/PoliBotChatScreen';
import NewsFeedScreen from './src/screens/news/NewsFeedScreen';
import NewsDetailScreen from './src/screens/news/NewsDetailScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import ElectionCountdownScreen from './src/screens/elections/ElectionCountdownScreen';
import PastElectionsScreen from './src/screens/elections/PastElectionsScreen';
import DirectoryScreen from './src/screens/politicianDirectory/DirectoryScreen';
import ProfileScreen from './src/screens/politicianProfile/ProfileScreen';
import PoliticianPromisesScreen from './src/screens/promises_&_growth/PoliticianPromisesScreen';
import GrowthNewsScreen from './src/screens/promises_&_growth/GrowthNewsScreen';
import MinistryPerformanceScreen from './src/screens/promises_&_growth/MinistryPerformanceScreen';
import PromiseDetailScreen from './src/screens/promises_&_growth/PromiseDetailScreen';
import GrowthNewsDetailScreen from './src/screens/promises_&_growth/GrowthNewsDetailScreen';
import QuizHistoryScreen from './src/screens/politicalQuiz/QuizHistoryScreen';
import QuizSummaryScreen from './src/screens/politicalQuiz/QuizSummaryScreen';
import QuizDetailScreen from './src/screens/politicalQuiz/QuizDetailScreen';
import type { RootStackParamList } from './src/navigation/types';
import './global.css';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      
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
      
        <Stack.Screen name="PoliticianPromises" component={PoliticianPromisesScreen} />
        <Stack.Screen name="GrowthNews" component={GrowthNewsScreen} />
        <Stack.Screen name="MinistryPerformance" component={MinistryPerformanceScreen} />
        <Stack.Screen name="PromiseDetail" component={PromiseDetailScreen} />
        <Stack.Screen name="GrowthNewsDetail" component={GrowthNewsDetailScreen} />
        <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
        <Stack.Screen name="QuizSummary" component={QuizSummaryScreen} />
        <Stack.Screen name="QuizDetail" component={QuizDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}
