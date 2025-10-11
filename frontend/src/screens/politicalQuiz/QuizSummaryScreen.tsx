import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { UserAnswer } from '../../services/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizSummary'>;

const QuizSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userAnswers, language } = route.params;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">Quiz Summary</Text>
        </View>
        <Text className="text-blue-100 text-sm">Review your answers</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-700 mb-6">
          You answered {userAnswers.length} questions in {language}.
        </Text>

        {userAnswers.map((answer, index) => (
          <View key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-medium text-gray-800 mb-3">
              {index + 1}. {answer.question}
            </Text>
            
            <View className="mb-2">
              <Text className="text-sm text-gray-500">Your answer:</Text>
              <Text className={`${
                answer.userAnswer === answer.correctAnswer 
                  ? 'text-green-600' 
                  : 'text-red-600'
              } font-medium`}>
                {answer.userAnswer || 'Not answered'}
              </Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500">Correct answer:</Text>
              <Text className="text-green-600 font-medium">{answer.correctAnswer}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuizSummaryScreen;