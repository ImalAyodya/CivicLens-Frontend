import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'PoliticalQuiz'>;

const PoliticalQuizScreen: React.FC<Props> = ({ navigation }) => {
  const handleStartQuiz = () => {
    navigation.navigate('QuizQuestion', {
      questionId: 1, 
      totalQuestions: 8,
      score: 0
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Button */}
      <View className="bg-white shadow-sm p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Political Quiz</Text>
      </View>

      <View className="bg-blue-600 p-4 items-center">
        <View className="flex-row items-center justify-center">
          <Text className="text-white text-2xl mr-2">🏛️</Text>
          <Text className="text-white text-xl font-bold">Political Quiz</Text>
        </View>
        <Text className="text-blue-100 text-sm">Discover Your Political Potential</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center mt-6 mb-4">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">🗳️</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            Test Your Potential as a <Text className="text-blue-600">Politician!</Text>
          </Text>
        </View>

        <Card className="mx-4 p-4 mb-6 bg-blue-50">
          <View className="flex-row items-center mb-2">
            <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center mr-2">
              <Text className="text-white font-bold">i</Text>
            </View>
            <Text className="text-gray-700 font-medium">
              This comprehensive quiz will evaluate your understanding of political issues, decision-making skills, and knowledge of governance.
            </Text>
          </View>
        </Card>

        <View className="mx-4 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">What You'll Discover</Text>

          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Text className="text-blue-600 text-lg">🧠</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Political Knowledge</Text>
                <Text className="text-gray-500 text-sm">Test your understanding of key political issues</Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-yellow-100 items-center justify-center mr-3">
                <Text className="text-yellow-600 text-lg">💡</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Decision Making</Text>
                <Text className="text-gray-500 text-sm">Evaluate your leadership skills</Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-lg">🏢</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Governance Insight</Text>
                <Text className="text-gray-500 text-sm">Understand public administration</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mx-4 mb-6">
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-blue-600 font-bold text-xl">15</Text>
              <Text className="text-gray-500 text-xs">Questions</Text>
            </View>
            <View className="items-center">
              <Text className="text-amber-500 font-bold text-xl">5</Text>
              <Text className="text-gray-500 text-xs">Minutes</Text>
            </View>
            <View className="items-center">
              <Text className="text-green-600 font-bold text-xl">100%</Text>
              <Text className="text-gray-500 text-xs">Accurate</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mb-8">
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-4 items-center flex-row justify-center"
            onPress={handleStartQuiz}
          >
            <Text className="text-white font-bold mr-2">▶</Text>
            <Text className="text-white font-bold text-lg">Start Quiz</Text>
          </TouchableOpacity>
          <Text className="text-center text-gray-500 text-xs mt-2">
            Takes about 5 minutes to complete
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PoliticalQuizScreen;