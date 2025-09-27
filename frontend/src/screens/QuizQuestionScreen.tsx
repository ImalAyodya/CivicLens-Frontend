import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizQuestion'>;

interface QuizQuestion {
  id: number;
  title: string;
  type: 'multiple' | 'essay' | 'ranking';
  options?: string[];
  correctOption?: number;
  hint?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: 'Which of the following best describes Sri Lanka\'s form of government?',
    type: 'multiple',
    options: [
      'Federal Republic',
      'Semi-Presidential Republic',
      'Parliamentary Republic',
      'Constitutional Monarchy'
    ],
    correctOption: 1,
    hint: 'Sri Lanka has both a President and Prime Minister with specific constitutional powers.'
  },
  {
    id: 2,
    title: 'What is the term length for the President of Sri Lanka?',
    type: 'multiple',
    options: [
      '4 years',
      '5 years',
      '6 years',
      '7 years'
    ],
    correctOption: 1,
    hint: 'The term was reduced following a constitutional amendment.'
  },
  {
    id: 3,
    title: 'Explain your understanding of how the 13th Amendment to the Sri Lankan Constitution impacts provincial governance:',
    type: 'essay',
    hint: 'Consider aspects of devolution of power and provincial councils.'
  },
  {
    id: 4,
    title: 'Which political party has held power for the most years since Sri Lanka\'s independence?',
    type: 'multiple',
    options: [
      'United National Party (UNP)',
      'Sri Lanka Freedom Party (SLFP)',
      'Sri Lanka Podujana Peramuna (SLPP)',
      'Tamil National Alliance (TNA)'
    ],
    correctOption: 1,
    hint: 'Consider which parties have historically alternated in power since 1948.'
  },
  {
    id: 5,
    title: 'What measures would you implement to address ethnic reconciliation in Sri Lanka? Explain your approach and expected outcomes:',
    type: 'essay',
    hint: 'Consider language policies, devolution of power, and historical grievances.'
  },
  {
    id: 6,
    title: 'Rank these economic priorities for Sri Lanka from most important (1) to least important (4):',
    type: 'ranking',
    options: [
      'Reducing foreign debt',
      'Increasing tourism',
      'Agricultural self-sufficiency',
      'Technology sector development'
    ],
    hint: 'Consider both immediate economic challenges and long-term development goals.'
  },
  {
    id: 7,
    title: 'Which of these leaders was NOT a President of Sri Lanka?',
    type: 'multiple',
    options: [
      'Chandrika Kumaratunga',
      'Ranil Wickremesinghe',
      'Maithripala Sirisena',
      'Sirimavo Bandaranaike'
    ],
    correctOption: 3,
    hint: 'Consider who held the position of Prime Minister versus President.'
  },
  {
    id: 8,
    title: 'How would you address Sri Lanka\'s economic challenges while balancing international relations? Detail your policy approach:',
    type: 'essay',
    hint: 'Consider IMF involvement, relations with India, China, and Western nations.'
  }
];

const QuizQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { questionId, totalQuestions, score } = route.params;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState('');
  const [rankings, setRankings] = useState<number[]>([0, 0, 0, 0]);
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentQuestion = quizQuestions[questionId - 1];
  const progress = (questionId / totalQuestions) * 100;
  
  const isLastQuestion = questionId === totalQuestions;
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleRankingChange = (optionIndex: number, rank: number) => {
    // Create a new array to avoid state mutation issues
    const newRankings = [...rankings];
    
    // If this rank is already assigned, find and reset it
    const existingIndex = newRankings.findIndex(r => r === rank);
    if (existingIndex !== -1 && existingIndex !== optionIndex) {
      newRankings[existingIndex] = 0;
    }
    
    // Assign the new rank
    newRankings[optionIndex] = rank;
    setRankings(newRankings);
  };
  
  const handleNext = () => {
    let newScore = score;
    
    // Calculate score for multiple choice questions
    if (currentQuestion.type === 'multiple' && selectedOption === currentQuestion.correctOption) {
      newScore += 1;
    }
    
    // For essay and ranking, we'll just give participation points
    if (currentQuestion.type === 'essay' && essayAnswer.trim().length > 10) {
      newScore += 1;
    }
    
    if (currentQuestion.type === 'ranking' && rankings.filter(r => r > 0).length === 4) {
      newScore += 1;
    }
    
    // Navigate to results on last question, otherwise next question
    if (isLastQuestion) {
      navigation.navigate('QuizResult', {
        score: newScore,
        totalQuestions: totalQuestions
      });
    } else {
      navigation.navigate('QuizQuestion', {
        questionId: questionId + 1,
        totalQuestions: totalQuestions,
        score: newScore
      });
    }
  };
  
  const handlePrevious = () => {
    if (questionId > 1) {
      navigation.navigate('QuizQuestion', {
        questionId: questionId - 1,
        totalQuestions: totalQuestions,
        score: score
      });
    } else {
      navigation.navigate('PoliticalQuiz');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">Sri Lanka Political Quiz</Text>
        </View>
        <Text className="text-blue-100 text-sm">Question {questionId} of {totalQuestions}</Text>
      </View>
      
      {/* Progress bar */}
      <View className="px-4 py-2 border-b border-gray-200">
        <Text className="text-gray-500 text-xs mb-1">Progress</Text>
        <View className="h-2 bg-gray-200 rounded-full">
          <View 
            className="h-2 bg-blue-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-right text-blue-600 text-xs mt-1">{Math.round(progress)}%</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Question */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="h-8 w-8 rounded-full bg-blue-600 items-center justify-center mr-3">
              <Text className="text-white font-bold">Q</Text>
            </View>
            <Text className="text-lg font-medium text-gray-800 flex-1">
              {currentQuestion.title}
            </Text>
          </View>
          
          {currentQuestion.type === 'multiple' && (
            <Text className="text-sm text-gray-500 mb-4">Multiple Choice</Text>
          )}
          
          {/* Answer options based on question type */}
          {currentQuestion.type === 'multiple' && currentQuestion.options?.map((option, index) => (
            <TouchableOpacity 
              key={index}
              className={`border rounded-lg p-4 mb-3 ${
                selectedOption === index ? 'bg-blue-50 border-blue-400' : 'border-gray-200'
              }`}
              onPress={() => handleOptionSelect(index)}
            >
              <View className="flex-row items-center">
                <View className={`h-5 w-5 rounded-full border ${
                  selectedOption === index ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                } mr-3 items-center justify-center`}>
                  {selectedOption === index && (
                    <View className="h-2 w-2 rounded-full bg-white" />
                  )}
                </View>
                <Text className={`${
                  selectedOption === index ? 'text-blue-800' : 'text-gray-800'
                }`}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {currentQuestion.type === 'essay' && (
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-2">Write your answer:</Text>
              <TextInput
                multiline
                numberOfLines={6}
                value={essayAnswer}
                onChangeText={setEssayAnswer}
                className="border border-gray-200 rounded-lg p-3 text-gray-800"
                placeholder="Type your answer here..."
                textAlignVertical="top"
              />
            </View>
          )}
          
          {currentQuestion.type === 'ranking' && (
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-4">Drag or select ranking for each option:</Text>
              {currentQuestion.options?.map((option, index) => (
                <View key={index} className="flex-row items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                  <Text className="flex-1 text-gray-800">{option}</Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4].map(rank => (
                      <TouchableOpacity 
                        key={rank}
                        onPress={() => handleRankingChange(index, rank)}
                        className={`h-8 w-8 rounded-full mx-1 items-center justify-center ${
                          rankings[index] === rank ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <Text className={rankings[index] === rank ? 'text-white' : 'text-gray-600'}>
                          {rank}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {/* Hint */}
          <TouchableOpacity 
            className="flex-row items-center mt-2" 
            onPress={() => setShowHint(!showHint)}
          >
            <View className="h-5 w-5 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-600 text-xs">💡</Text>
            </View>
            <Text className="text-blue-600 text-sm">Hint</Text>
          </TouchableOpacity>
          
          {showHint && currentQuestion.hint && (
            <View className="bg-blue-50 p-3 rounded-lg mt-2">
              <Text className="text-blue-800 text-sm">{currentQuestion.hint}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Navigation buttons */}
      <View className="p-4 flex-row border-t border-gray-200">
        <TouchableOpacity 
          className="flex-1 border border-gray-300 rounded-lg py-3 mr-2 items-center"
          onPress={handlePrevious}
        >
          <Text className="text-gray-700">← Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-blue-600 rounded-lg py-3 ml-2 items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-medium">
            {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuizQuestionScreen;