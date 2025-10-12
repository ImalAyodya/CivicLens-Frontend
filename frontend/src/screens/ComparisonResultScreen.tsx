import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'ComparisonResult'>;

const ComparisonResultScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get the selected politicians from the route params
  const { politician1, politician2 } = route.params;

  // Hardcoded Sri Lankan politician comparison data
  const politicianData = {
    [politician1.id]: {
      name: 'Ranil Wickremesinghe',
      position: 'President of Sri Lanka',
      party: 'United National Party',
      image: '🧑‍💼',
      performanceScore: 80,
      promisesFulfilled: 80,
      citizenSatisfaction: 75,
      keyAchievements: [
        'Economic reform',
        'Public infrastructure',
        'Healthcare improvements',
        'Education reforms'
      ],
      promiseStatus: {
        completed: 45,
        pending: 12,
        failed: 3
      },
      performanceHistory: [
        { year: 2005, score: 74 },
        { year: 2010, score: 75 },
        { year: 2015, score: 78 },
        { year: 2020, score: 80 }
      ]
    },
    [politician2.id]: {
      name: 'Mahinda Rajapaksa',
      position: 'Former President',
      party: 'Sri Lanka Podujana Peramuna',
      image: '🧑‍💼',
      performanceScore: 72,
      promisesFulfilled: 72,
      citizenSatisfaction: 65,
      keyAchievements: [
        'Infrastructure development',
        'National security',
        'Rural development',
        'Tourism growth'
      ],
      promiseStatus: {
        completed: 38,
        pending: 15,
        failed: 7
      },
      performanceHistory: [
        { year: 2005, score: 68 },
        { year: 2010, score: 71 },
        { year: 2015, score: 70 },
        { year: 2020, score: 72 }
      ]
    }
  };

  const pol1 = politicianData[politician1.id];
  const pol2 = politicianData[politician2.id];

  // For feedback form
  const [feedbackText, setFeedbackText] = useState('');

  // Share comparison
  const handleShareComparison = async () => {
    try {
      await Share.share({
        message: `Comparison of ${pol1.name} vs ${pol2.name}: ${pol1.name} has a performance score of ${pol1.performanceScore}% while ${pol2.name} has ${pol2.performanceScore}%.`,
        title: 'Politician Performance Comparison'
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Download report
  const handleDownloadReport = () => {
    // In a real app, generate and download a PDF or similar
    console.log('Downloading comparison report...');
  };

  // Submit feedback
  const handleSubmitFeedback = () => {
    console.log('Submitting feedback:', feedbackText);
    setFeedbackText('');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white shadow-sm p-4 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="flex-row items-center"
        >
          <Text className="text-gray-800 mr-2">←</Text>
          <Text className="text-gray-800">Back to Selection</Text>
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity onPress={handleShareComparison} className="mr-4">
            <Text className="text-gray-800">⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownloadReport}>
            <Text className="text-gray-800">↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Title */}
        <View className="p-4">
          <Text className="text-gray-900 text-2xl font-bold">Politician Comparison</Text>
          <Text className="text-gray-500 mt-1">
            Comparing the performance of {pol1.name} and {pol2.name}
          </Text>
        </View>

        {/* Politician profiles */}
        <View className="flex-row justify-between px-4 mb-4">
          <View className="items-center flex-1">
            <Text className="text-4xl mb-1">{pol1.image}</Text>
            <Text className="text-gray-900 font-medium text-center">{pol1.name}</Text>
            <Text className="text-gray-500 text-xs text-center">{pol1.position}</Text>
            <View className="bg-blue-100 rounded-full px-3 py-1 mt-2">
              <Text className="text-blue-800 text-xs">{pol1.promisesFulfilled}% Fulfilled</Text>
            </View>
          </View>
          <View className="items-center flex-1">
            <Text className="text-4xl mb-1">{pol2.image}</Text>
            <Text className="text-gray-900 font-medium text-center">{pol2.name}</Text>
            <Text className="text-gray-500 text-xs text-center">{pol2.position}</Text>
            <View className="bg-green-100 rounded-full px-3 py-1 mt-2">
              <Text className="text-green-800 text-xs">{pol2.promisesFulfilled}% Fulfilled</Text>
            </View>
          </View>
        </View>

        {/* Performance Scores */}
        <View className="flex-row justify-between px-4 mb-4">
          <View className="bg-gray-100 rounded-lg p-4 flex-1 mr-2 items-center">
            <Text className="text-gray-500 text-xs mb-1">Performance Score</Text>
            <Text className="text-blue-700 text-3xl font-bold">{pol1.performanceScore}%</Text>
          </View>
          <View className="bg-gray-100 rounded-lg p-4 flex-1 ml-2 items-center">
            <Text className="text-gray-500 text-xs mb-1">Performance Score</Text>
            <Text className="text-green-700 text-3xl font-bold">{pol2.performanceScore}%</Text>
          </View>
        </View>

        {/* Key Metrics Comparison */}
        <View className="px-4 mb-4">
          <Text className="text-gray-900 text-lg font-bold mb-3">Key Metrics Comparison</Text>
          
          <View className="mb-3">
            <Text className="text-blue-700 mb-1">Promises Fulfilled</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-700 mr-2">{pol1.promisesFulfilled}%</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View className="bg-blue-500 h-2 rounded-full" style={{ width: `${pol1.promisesFulfilled}%` }} />
              </View>
              <Text className="text-green-700 ml-2">{pol2.promisesFulfilled}%</Text>
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-blue-700 mb-1">Citizen Satisfaction</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-700 mr-2">{pol1.citizenSatisfaction}%</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View className="bg-blue-500 h-2 rounded-full" style={{ width: `${pol1.citizenSatisfaction}%` }} />
              </View>
              <Text className="text-green-700 ml-2">{pol2.citizenSatisfaction}%</Text>
            </View>
          </View>
          
          <View>
            <Text className="text-blue-700 mb-1">Key Achievements</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-700 mr-2">{pol1.keyAchievements.length}</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View className="bg-blue-500 h-2 rounded-full" style={{ width: `${(pol1.keyAchievements.length / 6) * 100}%` }} />
              </View>
              <Text className="text-green-700 ml-2">{pol2.keyAchievements.length}</Text>
            </View>
          </View>
        </View>

        {/* Key Achievements */}
        <View className="flex-row px-4 mb-6">
          <View className="flex-1 mr-2">
            <Text className="text-gray-900 font-medium mb-2">Key Achievements</Text>
            {pol1.keyAchievements.map((achievement, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <View className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                <Text className="text-gray-700 text-xs">{achievement}</Text>
              </View>
            ))}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-900 font-medium mb-2">Key Achievements</Text>
            {pol2.keyAchievements.map((achievement, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                <Text className="text-gray-700 text-xs">{achievement}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Promise Status */}
        <View className="flex-row px-4 mb-6">
          <View className="flex-1 mr-2">
            <Text className="text-gray-900 font-medium mb-2">Promise Status</Text>
            <View className="flex-row items-center mb-1">
              <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Completed</Text>
              <Text className="text-blue-700 text-xs">{pol1.promiseStatus.completed}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <View className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Pending</Text>
              <Text className="text-blue-700 text-xs">{pol1.promiseStatus.pending}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="h-3 w-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Failed</Text>
              <Text className="text-blue-700 text-xs">{pol1.promiseStatus.failed}</Text>
            </View>
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-900 font-medium mb-2">Promise Status</Text>
            <View className="flex-row items-center mb-1">
              <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Completed</Text>
              <Text className="text-green-700 text-xs">{pol2.promiseStatus.completed}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <View className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Pending</Text>
              <Text className="text-green-700 text-xs">{pol2.promiseStatus.pending}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="h-3 w-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-gray-700 text-xs mr-1">Failed</Text>
              <Text className="text-green-700 text-xs">{pol2.promiseStatus.failed}</Text>
            </View>
          </View>
        </View>

        {/* Performance Chart */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 font-medium mb-2">Performance Over Time</Text>
          <View className="bg-gray-100 p-4 rounded-lg">
            <Text className="text-gray-400 text-xs mb-2">(%)</Text>
            <View className="h-40 flex-row items-end justify-between">
              {pol1.performanceHistory.map((point, index) => (
                <View key={index} className="items-center">
                  <View className="w-2 bg-blue-500 rounded-t-md" style={{ height: (point.score - 60) * 3 }} />
                  <Text className="text-gray-500 text-xs mt-1">{point.year}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 font-medium mb-2">Rate Their Performance</Text>
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-gray-900 text-center mb-1">{pol1.name}</Text>
              <View className="flex-row justify-center mb-2">
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-gray-300 text-xl">★</Text>
              </View>
              <View className="flex-row justify-center">
                <TouchableOpacity className="bg-green-100 rounded-full h-8 w-8 items-center justify-center mr-2">
                  <Text className="text-green-700">👍</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-100 rounded-full h-8 w-8 items-center justify-center">
                  <Text className="text-red-700">👎</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-900 text-center mb-1">{pol2.name}</Text>
              <View className="flex-row justify-center mb-2">
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-yellow-400 text-xl mr-1">★</Text>
                <Text className="text-gray-300 text-xl mr-1">★</Text>
                <Text className="text-gray-300 text-xl">★</Text>
              </View>
              <View className="flex-row justify-center">
                <TouchableOpacity className="bg-green-100 rounded-full h-8 w-8 items-center justify-center mr-2">
                  <Text className="text-green-700">👍</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-100 rounded-full h-8 w-8 items-center justify-center">
                  <Text className="text-red-700">👎</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View className="px-4 mb-6">
          <TouchableOpacity 
            className="bg-gray-100 rounded-lg p-3 items-center border border-gray-200"
            onPress={() => {}}
          >
            <Text className="text-gray-400">Share your thoughts on their performance...</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View className="px-4 mb-6">
          <TouchableOpacity 
            className="bg-blue-600 rounded-md py-3 items-center mb-4"
            onPress={handleSubmitFeedback}
          >
            <Text className="text-white font-medium">Submit Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-blue-600 rounded-md py-3 items-center flex-row justify-center mb-4"
            onPress={handleDownloadReport}
          >
            <Text className="text-white mr-2">↓</Text>
            <Text className="text-white font-medium">Download Comparison Report</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-gray-100 rounded-md py-3 items-center flex-row justify-center border border-gray-200"
            onPress={handleShareComparison}
          >
            <Text className="text-blue-700 mr-2">↗</Text>
            <Text className="text-blue-700 font-medium">Share Comparison</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ComparisonResultScreen;