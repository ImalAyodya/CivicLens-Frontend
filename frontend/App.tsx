import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
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
import PoliticianPromisesScreen from './src/screens/promises_&_growth/PoliticianPromisesScreen';
import GrowthNewsScreen from './src/screens/promises_&_growth/GrowthNewsScreen';
import MinistryPerformanceScreen from '~/screens/promises_&_growth/MinistryPerformanceScreen';
// import PromiseDetailScreen from './src/screens/promises_&_growth/PromiseDetailScreen';
import GrowthNewsDetailScreen from './src/screens/promises_&_growth/GrowthNewsDetailScreen';
import QuizHistoryScreen from './src/screens/politicalQuiz/QuizHistoryScreen';
import QuizSummaryScreen from './src/screens/politicalQuiz/QuizSummaryScreen';
import QuizDetailScreen from './src/screens/politicalQuiz/QuizDetailScreen';

import HelpAndSupportScreen from './src/screens/common/HelpAndSupportScreen';
import SupportHistoryScreen from './src/screens/common/SupportHistoryScreen';
import SupportDetailScreen from './src/screens/common/SupportDetailScreen';

// Admin screens
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminSupportTicketsScreen from './src/screens/admin/AdminSupportTicketsScreen';
import AdminTicketDetailScreen from './src/screens/admin/AdminTicketDetailScreen';

import ProfileScreen from './src/screens/ProfileScreen';
import PublicEngagementScoreScreen from './src/screens/promises_&_growth/PublicEngagementScoreScreen';
import type { RootStackParamList } from './src/navigation/types';

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
        <Stack.Screen name="PoliticianPromises" component={PoliticianPromisesScreen} />
        <Stack.Screen name="GrowthNews" component={GrowthNewsScreen} />
        <Stack.Screen name="MinistryPerformance" component={MinistryPerformanceScreen} />
        {/* <Stack.Screen name="PromiseDetail" component={PromiseDetailScreen} /> */}
        <Stack.Screen name="GrowthNewsDetail" component={GrowthNewsDetailScreen} />
        <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
        <Stack.Screen name="QuizSummary" component={QuizSummaryScreen} />
        <Stack.Screen name="QuizDetail" component={QuizDetailScreen} />
        <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
        <Stack.Screen name="SupportHistory" component={SupportHistoryScreen} />
        <Stack.Screen name="SupportDetail" component={SupportDetailScreen} />
        
        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminSupportTickets" component={AdminSupportTicketsScreen} />
        <Stack.Screen name="AdminTicketDetail" component={AdminTicketDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PublicEngagementScore" component={PublicEngagementScoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}