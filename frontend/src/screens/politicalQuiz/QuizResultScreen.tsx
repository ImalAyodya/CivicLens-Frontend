import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { analyzeQuizAnswers, saveQuizHistory } from '../../services/APIservices';
import { QuizAnalysisResponse, UserAnswer } from '../../services/types';
import { useUser } from '../../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const QuizResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { totalQuestions, language, userAnswers } = route.params;
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [resultCategory, setResultCategory] = useState('');
  const [resultDescription, setResultDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<QuizAnalysisResponse | null>(null);
  
  const { user } = useUser(); // Get user from context
  
  useEffect(() => {
    // Count how many questions the user actually answered
    if (Array.isArray(userAnswers)) {
      const answered = userAnswers.filter(a => 
        a.userAnswer !== null && a.userAnswer !== ''
      ).length;
      setAnsweredQuestions(answered);
    }
  }, [userAnswers]);
  
  // Update the useEffect for analysis
  useEffect(() => {
    // Get AI analysis of user answers
    const getAIAnalysis = async () => {
      if (!userAnswers || !Array.isArray(userAnswers) || userAnswers.length === 0) {
        setIsAnalyzing(false);
        return;
      }
      
      try {
        console.log("Sending answers for analysis:", userAnswers.length);
        const analysisResult = await analyzeQuizAnswers(userAnswers, language);
        
        if (analysisResult && analysisResult.success) {
          setAiAnalysis(analysisResult);
          
          if (typeof analysisResult.score === 'number') {
            // Use AI-calculated score
            const aiScore = Math.round(analysisResult.score);
            setPercentage(aiScore);
            console.log("Score calculated:", aiScore, "using AI:", analysisResult.aiAnalyzed || false);
          }
          
          // Update category using the updated percentage value
          updateResultCategory(typeof analysisResult.score === 'number' ? 
            Math.round(analysisResult.score) : percentage);
            
          // Show fallback notification if AI wasn't used
          if (analysisResult.aiAnalyzed === false && analysisResult.message) {
            // Optional: Show some notification that basic scoring was used
            console.log("Using basic scoring instead of AI");
          }
        }
      } catch (error) {
        console.error('Error getting analysis:', error);
        // Handle error - could set a fallback percentage based on MCQs only
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    getAIAnalysis();
  }, [userAnswers, language]);
  
  // Function to update result category based on percentage
  const updateResultCategory = (scorePercentage: number) => {
    if (scorePercentage >= 90) {
      setResultCategory('Political Expert');
      setResultDescription('Your knowledge of Sri Lankan politics is exceptional! You have what it takes to be a great political leader or analyst.');
    } else if (scorePercentage >= 75) {
      setResultCategory('Political Enthusiast');
      setResultDescription('You have strong knowledge of Sri Lankan politics and governance. With some more experience, you could excel in political leadership.');
    } else if (scorePercentage >= 60) {
      setResultCategory('Informed Citizen');
      setResultDescription('You have a solid understanding of Sri Lankan politics. Continue expanding your knowledge to become more politically engaged.');
    } else if (scorePercentage >= 40) {
      setResultCategory('Political Learner');
      setResultDescription('You have a basic understanding of Sri Lankan politics. Keep learning to become a more informed voter and citizen.');
    } else {
      setResultCategory('Political Novice');
      setResultDescription('You\'re just starting to learn about Sri Lankan politics. Continue exploring to build your knowledge and political awareness.');
    }
  };
  
  const handleShareResults = async () => {
    try {
      await Share.share({
        message: `I scored ${percentage}% on the Sri Lankan Political Quiz and ranked as a "${resultCategory}"! Test your knowledge too!`,
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
  
  // Add this new function to handle saving the quiz
  const handleSaveQuiz = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to save your quiz results.');
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await saveQuizHistory(
        user.id,
        user.username,
        language,
        percentage,
        totalQuestions,
        resultCategory,
        aiAnalysis?.feedback || resultDescription,
        userAnswers
      );
      
      if (result.success) {
        setQuizSaved(true);
        Alert.alert('Success', 'Quiz results saved to your history!');
      } else {
        throw new Error(result.message || 'Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Failed to save quiz results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-4">
        <Text className="text-white text-xl font-bold text-center">Quiz Results</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {isAnalyzing ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-600 mt-4">Analyzing your answers...</Text>
            <Text className="text-gray-500 mt-2 text-sm">Our AI is reviewing your responses</Text>
          </View>
        ) : (
          <>
            {/* Score display */}
            <View className="items-center justify-center mb-8">
              <View className="h-40 w-40 rounded-full bg-blue-100 items-center justify-center mb-4">
                <Text className="text-5xl font-bold text-blue-600">{percentage}%</Text>
                <Text className="text-blue-800 mt-1">Score</Text>
              </View>
              <Text className="text-gray-700">AI analyzed <Text className="font-bold">{answeredQuestions}</Text> of your answers</Text>
            </View>
            
            {/* Result category */}
            <View className="bg-blue-50 rounded-lg p-5 mb-6">
              <Text className="text-2xl font-bold text-center text-blue-800 mb-3">
                {resultCategory}
              </Text>
              <Text className="text-gray-700 text-center">
                {aiAnalysis && aiAnalysis.feedback ? aiAnalysis.feedback : resultDescription}
              </Text>
            </View>
            
            {/* Quiz Summary Button */}
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <TouchableOpacity 
                className="flex-row items-center justify-between"
                onPress={() => navigation.navigate('QuizSummary', { userAnswers, language })}
              >
                <Text className="text-blue-800 font-medium">View Quiz Summary</Text>
                <Text className="text-blue-800">→</Text>
              </TouchableOpacity>
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
              {/* Add save button */}
              <TouchableOpacity 
                className={`${
                  quizSaved 
                    ? 'bg-green-600' 
                    : isSaving 
                      ? 'bg-gray-400' 
                      : 'bg-blue-600'
                } rounded-lg py-3 items-center mb-3`}
                onPress={handleSaveQuiz}
                disabled={isSaving || quizSaved}
              >
                {isSaving ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                    <Text className="text-white font-medium">Saving...</Text>
                  </View>
                ) : (
                  <Text className="text-white font-medium">
                    {quizSaved ? '✓ Saved to History' : 'Save Quiz Results'}
                  </Text>
                )}
              </TouchableOpacity>
              
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
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default QuizResultScreen;