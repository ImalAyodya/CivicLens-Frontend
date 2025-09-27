import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import VotingGuideCard from '../../components/elections/education/VotingGuideCard';
import StepByStepGuide from '../../components/elections/education/StepByStepGuide';
import QuizComponent from '../../components/elections/education/QuizComponent';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'VoterEducation'>;

// Mock data for first-time voter steps
const firstTimeVoterSteps = [
  {
    id: '1',
    title: 'Check registration',
    description: 'Verify your voter registration status by visiting the Election Commission website or calling the hotline 1950.',
    icon: 'checkmark-circle-outline'
  },
  {
    id: '2',
    title: 'Find your polling station',
    description: 'Locate your designated polling station from your voter information card or online portal.',
    icon: 'location-outline'
  },
  {
    id: '3',
    title: 'Bring ID',
    description: 'Bring your National ID card, passport, or driving license for verification at the polling station.',
    icon: 'card-outline'
  },
  {
    id: '4',
    title: 'Mark your ballot',
    description: 'Place a cross (✗) or preferred symbol in the box next to your chosen candidate.',
    icon: 'create-outline'
  },
  {
    id: '5',
    title: 'Submit your vote',
    description: 'Fold your ballot paper and place it in the designated ballot box.',
    icon: 'enter-outline'
  }
];

// Mock quiz question
const sampleQuizQuestion = {
  id: 'q1',
  question: 'What mark should you use on a Sri Lankan ballot paper to indicate your choice?',
  options: [
    'A checkmark (✓)',
    'A cross (✗)',
    'Fill in the circle completely',
    'Your signature'
  ],
  correctOptionIndex: 1 // Cross is the correct answer
};

const VoterEducationScreen: React.FC<Props> = ({ navigation }) => {
  const [quizScore, setQuizScore] = useState(0);
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleAnswerSelected = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={handleGoBack} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Voter Education</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Introduction */}
        <Animated.View entering={FadeIn.duration(400)} className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Know Your Voting Rights</Text>
          <Text className="text-gray-600">
            Understanding the voting process is essential for exercising your democratic rights. 
            Explore our guides to become an informed voter.
          </Text>
        </Animated.View>
        
        {/* Voting Guides */}
        <Animated.View entering={FadeIn.delay(100).duration(400)}>
          <Text className="text-lg font-bold text-gray-800 mb-3">Voting Guides</Text>
          
          <VotingGuideCard 
            title="First-Time Voter Guide"
            description="Everything you need to know for your first time at the polling booth."
            imageSource={require('../../../assets/first-time-voter.png')}
            onPress={() => {}}
          />
          
          <VotingGuideCard 
            title="Understanding the Ballot"
            description="Learn how to properly fill out your ballot and ensure your vote counts."
            imageSource={require('../../../assets/ballot-guide.png')}
            onPress={() => {}}
          />
        </Animated.View>
        
        {/* Step by Step Guide */}
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <StepByStepGuide
            title="First-Time Voter Walkthrough"
            steps={firstTimeVoterSteps}
          />
        </Animated.View>
        
        {/* Interactive Elements */}
        <Animated.View entering={FadeIn.delay(300).duration(400)}>
          <QuizComponent
            question={sampleQuizQuestion}
            onAnswerSelected={handleAnswerSelected}
          />
        </Animated.View>
        
        {/* Document Requirements */}
        <Animated.View 
          entering={FadeIn.delay(400).duration(400)}
          className="bg-white rounded-lg p-4 mb-4"
        >
          <Text className="text-lg font-bold text-gray-800 mb-3">Required Documents</Text>
          
          <View className="flex-row items-center mb-3">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="card-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">National Identity Card</Text>
              <Text className="text-gray-600 text-sm">Primary identification document</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="document-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">Valid Passport</Text>
              <Text className="text-gray-600 text-sm">Alternative identification document</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="car-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">Driving License</Text>
              <Text className="text-gray-600 text-sm">Alternative identification document</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Special Accommodations */}
        <Animated.View 
          entering={FadeIn.delay(500).duration(400)}
          className="bg-white rounded-lg p-4 mb-4"
        >
          <Text className="text-lg font-bold text-gray-800 mb-3">Special Accommodations</Text>
          <Text className="text-gray-700 mb-3">
            The Election Commission provides special accommodations for elderly voters, 
            pregnant women, and persons with disabilities.
          </Text>
          
          <View className="bg-blue-50 p-3 rounded-lg">
            <Text className="text-blue-800 font-medium mb-1">Priority Voting Access</Text>
            <Text className="text-blue-700 text-sm">
              Elderly voters, pregnant women, and persons with disabilities can request priority 
              access at polling stations without waiting in line.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoterEducationScreen;