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
import DirectoryScreen from './src/screens/politicianDirectory/DirectoryScreen';
import AdminPanelScreen from './src/screens/adminPanel/AdminPanelScreen';
import HierarchyScreen from './src/screens/politicianHierarchy/HierarchyScreen';
import HierarchyPoliticianList from './src/screens/politicianHierarchy/HierarchyPoliticianList';
import AddPartyScreen from './src/screens/adminPanel/AddPartyScreen';
import PartyListScreen from './src/screens/adminPanel/PartyListScreen';
import PoliticianListScreen from './src/screens/adminPanel/PoliticianListScreen';
import AddPoliticianForm from './src/screens/adminPanel/AddPoliticianForm';
import PoliticianPromisesScreen from './src/screens/promises_&_growth/PoliticianPromisesScreen';
import GrowthNewsScreen from './src/screens/promises_&_growth/GrowthNewsScreen';
//import MinistryPerformanceScreen from '~/screens/promises_&_growth/MinistryPerformanceScreen';
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

import UserProfileScreen from './src/screens/ProfileScreen';
import PoliticianProfileScreen from './src/screens/politicianProfile/ProfileScreen';
import type { RootStackParamList } from './src/navigation/types';
import RoleListScreen from './src/screens/adminPanel/RoleListScreen';
import AddRoleScreen from './src/screens/adminPanel/AddRoleScreen';
import LevelListScreen from './src/screens/adminPanel/LevelListScreen';
import AddLevelScreen from './src/screens/adminPanel/AddLevelScreen';

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
        {/* <Stack.Screen name="PastElectionDetails" component={PastElectionDetailsScreen} /> */}
        <Stack.Screen name="DirectoryScreen" component={DirectoryScreen} />
        <Stack.Screen name="PoliticianDetails" component={PoliticianProfileScreen} />
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

      
        <Stack.Screen name="PoliticianPromises" component={PoliticianPromisesScreen} />
        <Stack.Screen name="GrowthNews" component={GrowthNewsScreen} />
        {/* <Stack.Screen name="MinistryPerformance" component={MinistryPerformanceScreen} /> */}
        {/* <Stack.Screen name="PromiseDetail" component={PromiseDetailScreen} /> */}
        <Stack.Screen name="GrowthNewsDetail" component={GrowthNewsDetailScreen} />
        <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
        <Stack.Screen name="SupportHistory" component={SupportHistoryScreen} />
        <Stack.Screen name="SupportDetail" component={SupportDetailScreen} />
        
        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminSupportTickets" component={AdminSupportTicketsScreen} />
        <Stack.Screen name="AdminTicketDetail" component={AdminTicketDetailScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}
