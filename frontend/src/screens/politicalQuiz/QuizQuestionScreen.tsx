import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { AIQuestion, UserAnswer } from '../../services/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizQuestion'>;

const QuizQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { questionId, totalQuestions, score, questions, language } = route.params;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typingAnswer, setTypingAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(route.params.userAnswers || []);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Safely get current question
  const currentQuestion: AIQuestion | undefined = Array.isArray(questions) && questionId > 0 && questionId <= questions.length 
    ? questions[questionId - 1] 
    : undefined;
  
  // Progress calculation
  const progress = (questionId / totalQuestions) * 100;
  
  // Check if this is the last question
  const isLastQuestion = questionId === totalQuestions;
  
  // Setup timer and clear inputs when questionId changes
  useEffect(() => {
    // Reset answer inputs when question changes
    setSelectedOption(null);
    setTypingAnswer('');
    setShowHint(false);
    
    // Set userAnswers from route params if they exist
    if (route.params.userAnswers) {
      setUserAnswers(route.params.userAnswers);
    }
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Optionally, auto-finish the quiz when time runs out
          navigation.navigate('QuizResult', {
            totalQuestions,
            language,
            userAnswers,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or when question changes
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, route.params.userAnswers]);
  // Handle selecting a multiple choice option
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  // Handle moving to next question
  const handleNext = () => {
    if (!currentQuestion) return;
    
    let userAnswer: string | null = null;
    
    // Store the current answer based on question type
    if (currentQuestion.type === 'MCQ') {
      userAnswer = selectedOption;
    } else if (currentQuestion.type === 'TRUE_FALSE') {
      userAnswer = selectedOption;
    } else if (currentQuestion.type === 'TYPING') {
      userAnswer = typingAnswer;
    }
    
    // Store this question and answer
    const answerData: UserAnswer = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer
    };
    
    // Create a new array with all previous answers plus the current one
    const newUserAnswers = [...userAnswers, answerData];
    
    // If last question, navigate to results
    if (isLastQuestion) {
      navigation.navigate('QuizResult', {
        totalQuestions,
        language,
        userAnswers: newUserAnswers // Now contains ALL answered questions
      });
    } else {
      // Navigate to next question with the updated answers array
      navigation.navigate('QuizQuestion', {
        questionId: questionId + 1,
        totalQuestions,
        score: 0,
        questions,
        language,
        userAnswers: newUserAnswers // Pass the growing array of answers
      });
    }
  };
  
  // Handle going back to previous question
  const handlePrevious = () => {
    if (questionId > 1) {
      navigation.navigate('QuizQuestion', {
        questionId: questionId - 1,
        totalQuestions,
        score,
        questions,
        language,
        userAnswers
      });
    } else {
      navigation.navigate('PoliticalQuiz');
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check if the current question has valid content
  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error: Question not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-600 px-4 py-2 rounded"
          onPress={() => navigation.navigate('PoliticalQuiz')}
        >
          <Text className="text-white">Return to Quiz Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {/* Countdown Timer */}
      <View className="px-4 py-2 flex-row justify-between items-center bg-white border-b border-gray-200">
        <Text className="text-gray-500 text-xs">Time Left</Text>
        <Text className={`text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Question */}
        <View className="mb-6">
          <View className="flex-row items-start mb-4">
            <View className="h-8 w-8 rounded-full bg-blue-600 items-center justify-center mr-3 mt-1">
              <Text className="text-white font-bold">Q</Text>
            </View>
            <Text className="text-lg font-medium text-gray-800 flex-1">
              {currentQuestion.question}
            </Text>
          </View>
          
          <Text className="text-sm text-gray-500 mb-4">
            {currentQuestion.type === 'MCQ' ? 'Multiple Choice' : 
             currentQuestion.type === 'TRUE_FALSE' ? 'True or False' : 'Long Answer'}
          </Text>
          
          {/* Answer options based on question type */}
          {currentQuestion.type === 'MCQ' && currentQuestion.options && (
            <View>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  className={`border rounded-lg p-4 mb-3 ${
                    selectedOption === option ? 'bg-blue-50 border-blue-400' : 'border-gray-200'
                  }`}
                  onPress={() => handleOptionSelect(option)}
                >
                  <View className="flex-row items-center">
                    <View className={`h-5 w-5 rounded-full border ${
                      selectedOption === option ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    } mr-3 items-center justify-center`}>
                      {selectedOption === option && (
                        <View className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Text className={`${
                      selectedOption === option ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {currentQuestion.type === 'TRUE_FALSE' && (
            <View>
              {['True', 'False'].map((option) => (
                <TouchableOpacity 
                  key={option}
                  className={`border rounded-lg p-4 mb-3 ${
                    selectedOption === option ? 'bg-blue-50 border-blue-400' : 'border-gray-200'
                  }`}
                  onPress={() => handleOptionSelect(option)}
                >
                  <View className="flex-row items-center">
                    <View className={`h-5 w-5 rounded-full border ${
                      selectedOption === option ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    } mr-3 items-center justify-center`}>
                      {selectedOption === option && (
                        <View className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Text className={`${
                      selectedOption === option ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {currentQuestion.type === 'TYPING' && (
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-2">Write your answer:</Text>
              <TextInput
                multiline
                numberOfLines={6}
                value={typingAnswer}
                onChangeText={setTypingAnswer}
                className="border border-gray-200 rounded-lg p-3 text-gray-800"
                placeholder="Type your answer here..."
                textAlignVertical="top"
              />
            </View>
          )}
          
          {/* Hint Toggle (optional feature) */}
          <TouchableOpacity 
            className="flex-row items-center mt-2" 
            onPress={() => setShowHint(!showHint)}
          >
            <View className="h-5 w-5 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-600 text-xs">💡</Text>
            </View>
            <Text className="text-blue-600 text-sm">Need a hint?</Text>
          </TouchableOpacity>
          
          {showHint && (
            <View className="bg-blue-50 p-3 rounded-lg mt-2">
              <Text className="text-blue-800 text-sm">
                Look for key concepts in Sri Lankan politics that relate to this question.
              </Text>
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
          className={`flex-1 rounded-lg py-3 ml-2 items-center ${
            // For MCQ and TRUE_FALSE, require an answer. For TYPING, any input is fine
            (((currentQuestion.type === 'MCQ' || currentQuestion.type === 'TRUE_FALSE') && !selectedOption) ||
            (currentQuestion.type === 'TYPING' && typingAnswer.trim().length < 5))
              ? 'bg-blue-300' 
              : 'bg-blue-600'
          }`}
          onPress={handleNext}
          disabled={
            ((currentQuestion.type === 'MCQ' || currentQuestion.type === 'TRUE_FALSE') && !selectedOption) ||
            (currentQuestion.type === 'TYPING' && typingAnswer.trim().length < 5)
          }
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