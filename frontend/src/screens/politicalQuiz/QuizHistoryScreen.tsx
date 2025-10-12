import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { getUserQuizHistory } from '../../services/APIservices';
import { useUser } from '../../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import BlueHeader from '../../components/BlueHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizHistory'>;

const QuizHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      const fetchQuizHistory = async () => {
        if (!user?.id) {
          setError('User not logged in');
          setIsLoading(false);
          return;
        }

        try {
          const result = await getUserQuizHistory(user.id);
          if (result.success) {
            setQuizzes(result.quizHistory);
          } else {
            throw new Error(result.message);
          }
        } catch (err) {
          setError('Failed to load quiz history');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuizHistory();
    }, [user?.id])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  const handleViewQuizDetail = (quizId: string) => {
    navigation.navigate('QuizDetail', { quizId });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading your quiz history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 text-lg mb-4">Error: {error}</Text>
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
      <BlueHeader title="Quiz History" onBack={() => navigation.goBack()} />
      {quizzes.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-600 text-lg text-center mb-6">
            You haven't taken any quizzes yet.
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-lg"
            onPress={() => navigation.navigate('PoliticalQuiz')}
          >
            <Text className="text-white font-medium">Take a Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
              onPress={() => handleViewQuizDetail(item._id)}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-medium text-gray-800">
                  {item.category}
                </Text>
                <View className="bg-blue-100 rounded-full px-3 py-1">
                  <Text className="text-blue-800 text-sm font-medium">{item.score}%</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500">{item.language} • {item.totalQuestions} questions</Text>
                <Text className="text-gray-500 text-sm">{formatDate(item.date)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default QuizHistoryScreen;