import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { comparePromises } from '../../services/APIservices';

type Props = NativeStackScreenProps<RootStackParamList, 'ComparisonResult'>;

interface PoliticianData {
  id: string;
  name: string;
  position: string;
  party: string;
  image: string;
  performanceScore: number;
  totalPromises: number;
  fulfilledPromises: number;
  brokenPromises: number;
  pendingPromises: number;
  publicApproval: number;
}

const ComparisonResultScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get the selected politicians from the route params
  const { politician1, politician2 } = route.params;
  const [comparisonData, setComparisonData] = useState<{pol1: PoliticianData | null, pol2: PoliticianData | null}>({
    pol1: null,
    pol2: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comparison data from backend
  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const response = await comparePromises([politician1.id, politician2.id]);
        
        if (response && response.length >= 2) {
          setComparisonData({
            pol1: {
              id: response[0].id,
              name: response[0].name,
              position: response[0].position,
              party: response[0].party,
              image: response[0].image || '🧑‍💼',
              performanceScore: response[0].performanceScore,
              totalPromises: response[0].totalPromises,
              fulfilledPromises: response[0].fulfilledPromises,
              brokenPromises: response[0].brokenPromises,
              pendingPromises: response[0].pendingPromises,
              publicApproval: response[0].publicApproval
            },
            pol2: {
              id: response[1].id,
              name: response[1].name,
              position: response[1].position,
              party: response[1].party,
              image: response[1].image || '🧑‍💼',
              performanceScore: response[1].performanceScore,
              totalPromises: response[1].totalPromises,
              fulfilledPromises: response[1].fulfilledPromises,
              brokenPromises: response[1].brokenPromises,
              pendingPromises: response[1].pendingPromises,
              publicApproval: response[1].publicApproval
            }
          });
          setError(null);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
        setError("Failed to load comparison data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [politician1.id, politician2.id]);

  const { pol1, pol2 } = comparisonData;

  // For feedback form
  const [feedbackText, setFeedbackText] = useState('');

  // Share comparison
  const handleShareComparison = async () => {
    if (!pol1 || !pol2) return;
    
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

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Loading comparison data...</Text>
      </View>
    );
  }

  if (error || !pol1 || !pol2) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">{error || "Failed to load comparison data"}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-md mb-4"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            {/* Replace text emoji with proper image */}
            <View className="h-20 w-20 rounded-full overflow-hidden mb-1">
              {pol1.image && pol1.image.startsWith('http') ? (
                <Image 
                  source={{ uri: pol1.image }}
                  className="h-20 w-20"
                  style={{ resizeMode: 'cover' }}
                  onError={(e) => console.log('Error loading image')}
                />
              ) : (
                <View className="h-20 w-20 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="person" size={40} color="#60a5fa" />
                </View>
              )}
            </View>
            <Text className="text-gray-900 font-medium text-center">{pol1.name}</Text>
            <Text className="text-gray-500 text-xs text-center">{pol1.position}</Text>
            <View className="bg-blue-100 rounded-full px-3 py-1 mt-2">
              <Text className="text-blue-800 text-xs">
                {pol1.totalPromises > 0 
                  ? `${Math.round((pol1.fulfilledPromises / pol1.totalPromises) * 100)}% Fulfilled` 
                  : '0% Fulfilled'}
              </Text>
            </View>
          </View>
          <View className="items-center flex-1">
            {/* Replace text emoji with proper image */}
            <View className="h-20 w-20 rounded-full overflow-hidden mb-1">
              {pol2.image && pol2.image.startsWith('http') ? (
                <Image 
                  source={{ uri: pol2.image }}
                  className="h-20 w-20"
                  style={{ resizeMode: 'cover' }}
                  onError={(e) => console.log('Error loading image')}
                />
              ) : (
                <View className="h-20 w-20 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="person" size={40} color="#10b981" />
                </View>
              )}
            </View>
            <Text className="text-gray-900 font-medium text-center">{pol2.name}</Text>
            <Text className="text-gray-500 text-xs text-center">{pol2.position}</Text>
            <View className="bg-green-100 rounded-full px-3 py-1 mt-2">
              <Text className="text-green-800 text-xs">
                {pol2.totalPromises > 0 
                  ? `${Math.round((pol2.fulfilledPromises / pol2.totalPromises) * 100)}% Fulfilled` 
                  : '0% Fulfilled'}
              </Text>
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
              <Text className="text-blue-700 mr-2">
                {pol1.totalPromises > 0 
                  ? Math.round((pol1.fulfilledPromises / pol1.totalPromises) * 100)
                  : 0}%
              </Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ 
                    width: `${pol1.totalPromises > 0 
                      ? Math.round((pol1.fulfilledPromises / pol1.totalPromises) * 100)
                      : 0}%` 
                  }}
                />
              </View>
              <Text className="text-green-700 ml-2">
                {pol2.totalPromises > 0 
                  ? Math.round((pol2.fulfilledPromises / pol2.totalPromises) * 100)
                  : 0}%
              </Text>
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-blue-700 mb-1">Public Approval</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-700 mr-2">{pol1.publicApproval}%</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${pol1.publicApproval}%` }}
                />
              </View>
              <Text className="text-green-700 ml-2">{pol2.publicApproval}%</Text>
            </View>
          </View>
          
          <View>
            <Text className="text-blue-700 mb-1">Total Promises</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-700 mr-2">{pol1.totalPromises}</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(pol1.totalPromises / Math.max(pol1.totalPromises, pol2.totalPromises, 1) * 100, 100)}%`
                  }}
                />
              </View>
              <Text className="text-green-700 ml-2">{pol2.totalPromises}</Text>
            </View>
          </View>
        </View>

        {/* Promise Status Comparison */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 font-medium mb-2">Promise Status</Text>
          <View className="flex-row justify-between">
            <View className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mr-2">
              <Text className="text-blue-700 font-medium text-center mb-2">{pol1.name}</Text>
              <View className="flex-row items-center mb-2">
                <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Completed</Text>
                <Text className="text-blue-700 text-xs font-medium">{pol1.fulfilledPromises}</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Pending</Text>
                <Text className="text-blue-700 text-xs font-medium">{pol1.pendingPromises}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Failed</Text>
                <Text className="text-blue-700 text-xs font-medium">{pol1.brokenPromises}</Text>
              </View>
            </View>
            <View className="bg-white border border-gray-200 rounded-lg p-3 flex-1 ml-2">
              <Text className="text-green-700 font-medium text-center mb-2">{pol2.name}</Text>
              <View className="flex-row items-center mb-2">
                <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Completed</Text>
                <Text className="text-green-700 text-xs font-medium">{pol2.fulfilledPromises}</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Pending</Text>
                <Text className="text-green-700 text-xs font-medium">{pol2.pendingPromises}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-gray-700 text-xs flex-1">Failed</Text>
                <Text className="text-green-700 text-xs font-medium">{pol2.brokenPromises}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View className="px-4 mb-6">
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