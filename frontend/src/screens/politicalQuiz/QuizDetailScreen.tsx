import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { deleteQuizHistory,  getQuizDetail } from '../../services/APIservices';
import { useFocusEffect } from '@react-navigation/native';

// Define a Quiz Answer interface to fix the TypeScript error
interface QuizAnswer {
  question: string;
  correctAnswer: string;
  userAnswer: string | null;
}

// Define a QuizDetail interface
interface QuizDetail {
  _id: string;
  userId: string;
  username: string;
  language: string;
  score: number;
  totalQuestions: number;
  category: string;
  feedback: string;
  questions: QuizAnswer[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'QuizDetail'>;

const QuizDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { quizId } = route.params;
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const result = await getQuizDetail(quizId);
        if (result.success) {
          setQuizDetail(result.quizDetail);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError('Failed to load quiz details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetail();
  }, [quizId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  const handleShareResults = async (): Promise<void> => {
    if (!quizDetail) return;
    
    try {
      await Share.share({
        message: `I scored ${quizDetail.score}% on the Sri Lankan Political Quiz and ranked as a "${quizDetail.category}"! Test your knowledge too!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDeleteQuiz = () => {
    console.log('[FRONTEND] Delete button pressed for quizId:', quizId);
    Alert.alert(
      "Delete Quiz History",
      "Are you sure you want to delete this quiz? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => confirmDeleteQuiz() // Call a separate function
        }
      ]
    );
  };

  const confirmDeleteQuiz = async () => {
  try {
    setIsDeleting(true);
    console.log('[FRONTEND] Confirmed delete, calling API...');
    const result = await deleteQuizHistory(quizId);
    console.log('[FRONTEND] Delete API result:', result);
    if (result.success) {
      Alert.alert(
        "Success",
        "Quiz history has been deleted successfully."
      );
      setTimeout(() => {
        navigation.navigate('QuizHistory');
      }, 2000); // 2 seconds delay
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    console.error('[FRONTEND] Error in handleDeleteQuiz:', err);
    Alert.alert("Error", "Failed to delete quiz history. Please try again later.");
  } finally {
    setIsDeleting(false);
  }
};
  useFocusEffect(
    React.useCallback(() => {
      const fetchQuizDetail = async () => {
        try {
          const result = await getQuizDetail(quizId);
          if (result.success) {
            setQuizDetail(result.quizDetail);
          } else {
            throw new Error(result.message);
          }
        } catch (err) {
          setError('Failed to load quiz details');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuizDetail();
    }, [quizId])
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading quiz details...</Text>
      </View>
    );
  }

  if (error || !quizDetail) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 text-lg mb-4">Error: {error || 'Quiz not found'}</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-medium">Go Back</Text>
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
          <Text className="text-white text-lg font-medium">Quiz Details</Text>
        </View>
        <Text className="text-blue-100 text-sm">{formatDate(quizDetail.date)}</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Score display */}
        <View className="items-center justify-center mb-8">
          <View className="h-40 w-40 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-5xl font-bold text-blue-600">{quizDetail.score}%</Text>
            <Text className="text-blue-800 mt-1">Score</Text>
          </View>
          <Text className="text-gray-700">
            {quizDetail.language} Quiz • {quizDetail.questions.length} questions
          </Text>
        </View>
        
        {/* Result category */}
        <View className="bg-blue-50 rounded-lg p-5 mb-6">
          <Text className="text-2xl font-bold text-center text-blue-800 mb-3">
            {quizDetail.category}
          </Text>
          <Text className="text-gray-700 text-center">
            {quizDetail.feedback}
          </Text>
        </View>
        
        {/* Toggle Questions & Answers */}
        <TouchableOpacity
          className="bg-white border border-blue-600 rounded-lg py-3 items-center mb-6"
          onPress={() => setShowAnswers(!showAnswers)}
        >
          <Text className="text-blue-600 font-medium">
            {showAnswers ? 'Hide Questions & Answers' : 'Show Questions & Answers'}
          </Text>
        </TouchableOpacity>

        {/* Questions & Answers */}
        {showAnswers && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Your Answers</Text>
            
            {quizDetail.questions.map((answer: QuizAnswer, index: number) => (
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
          </View>
        )}

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
            onPress={() => navigation.navigate('PoliticalQuiz')}
          >
            <Text className="text-blue-600 font-medium">Take New Quiz</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity 
            className="bg-white border border-red-500 rounded-lg py-3 items-center mb-3"
            onPress={confirmDeleteQuiz}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#ef4444" style={{ marginRight: 8 }} />
                <Text className="text-red-500 font-medium">Deleting...</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="trash-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
                <Text className="text-red-500 font-medium">Delete Quiz History</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuizDetailScreen;