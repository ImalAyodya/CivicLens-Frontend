import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';

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
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}