import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const QuizResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { score, totalQuestions } = route.params;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Determine result category based on percentage
  let resultCategory = '';
  let resultDescription = '';
  
  if (percentage >= 90) {
    resultCategory = 'Political Expert';
    resultDescription = 'Your knowledge of Sri Lankan politics is exceptional! You have what it takes to be a great political leader or analyst.';
  } else if (percentage >= 75) {
    resultCategory = 'Political Enthusiast';
    resultDescription = 'You have strong knowledge of Sri Lankan politics and governance. With some more experience, you could excel in political leadership.';
  } else if (percentage >= 60) {
    resultCategory = 'Informed Citizen';
    resultDescription = 'You have a solid understanding of Sri Lankan politics. Continue expanding your knowledge to become more politically engaged.';
  } else if (percentage >= 40) {
    resultCategory = 'Political Learner';
    resultDescription = 'You have a basic understanding of Sri Lankan politics. Keep learning to become a more informed voter and citizen.';
  } else {
    resultCategory = 'Political Novice';
    resultDescription = 'You\'re just starting to learn about Sri Lankan politics. Continue exploring to build your knowledge and political awareness.';
  }
  
  const handleShareResults = async () => {
    try {
      await Share.share({
        message: `I scored ${score}/${totalQuestions} (${percentage}%) on the Sri Lankan Political Quiz and ranked as a "${resultCategory}"! Test your knowledge too!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };
  
  const handleRetakeQuiz = () => {
    navigation.navigate('PoliticalQuiz');
  };
  
  const handleReturnHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-4">
        <Text className="text-white text-xl font-bold text-center">Quiz Results</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Score display */}
        <View className="items-center justify-center mb-8">
          <View className="h-40 w-40 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-5xl font-bold text-blue-600">{percentage}%</Text>
            <Text className="text-blue-800 mt-1">Score</Text>
          </View>
          <Text className="text-gray-700">You got <Text className="font-bold text-blue-600">{score}</Text> out of <Text className="font-bold">{totalQuestions}</Text> questions correct</Text>
        </View>
        
        {/* Result category */}
        <View className="bg-blue-50 rounded-lg p-5 mb-6">
          <Text className="text-2xl font-bold text-center text-blue-800 mb-3">
            {resultCategory}
          </Text>
          <Text className="text-gray-700 text-center">
            {resultDescription}
          </Text>
        </View>
        
        {/* Political fit */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Your Political Strengths</Text>
          
          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Policy Knowledge</Text>
            <View className="h-2 bg-gray-200 rounded-full mb-1">
              <View 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>
          
          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Leadership Potential</Text>
            <View className="h-2 bg-gray-200 rounded-full mb-1">
              <View 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${Math.min(percentage + 15, 100)}%` }}
              />
            </View>
          </View>
          
          <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Public Service Aptitude</Text>
            <View className="h-2 bg-gray-200 rounded-full mb-1">
              <View 
                className="h-2 bg-purple-500 rounded-full" 
                style={{ width: `${Math.min(percentage + 5, 100)}%` }}
              />
            </View>
          </View>
        </View>
        
        {/* Recommendations */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3">Recommendations</Text>
          <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <Text className="text-gray-700 mb-3">Based on your results, we recommend:</Text>
            <View className="flex-row items-center mb-2">
              <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
              <Text className="text-gray-700">Follow parliamentary proceedings on official channels</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
              <Text className="text-gray-700">Read political analysis from diverse sources</Text>
            </View>
            <View className="flex-row items-center">
              <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
              <Text className="text-gray-700">Participate in local community discussions</Text>
            </View>
          </View>
        </View>
        
        {/* Action buttons */}
        <View className="mb-8">
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-3 items-center mb-3"
            onPress={handleShareResults}
          >
            <Text className="text-white font-medium">Share Results</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-blue-600 rounded-lg py-3 items-center mb-3"
            onPress={handleRetakeQuiz}
          >
            <Text className="text-blue-600 font-medium">Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-gray-100 rounded-lg py-3 items-center"
            onPress={handleReturnHome}
          >
            <Text className="text-gray-700">Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuizResultScreen;