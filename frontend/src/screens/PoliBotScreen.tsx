import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Card from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'PoliBot'>;

const PoliBotScreen: React.FC<Props> = ({ navigation }) => {
  const handleStartChat = () => {
    navigation.navigate('PoliBotChat');
  };

  const handleDemo = () => {
    // Show demo of the bot capabilities
    console.log('Showing demo...');
  };

  const handleHelp = () => {
    // Show help information
    console.log('Showing help...');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Button */}
      <View className="bg-white shadow-sm p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">PoliBot</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center mt-8 mb-6">
          {/* Bot avatar */}
          <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-4">
            <Text className="text-white text-2xl">👨‍💼</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">Hello! I'm Your AI Assistant</Text>
          <Text className="text-gray-500 text-center mx-10 mt-2">
            I'm here to help you track politician performance, explore campaign promises, 
            and share your feedback.
          </Text>
        </View>

        {/* Features */}
        <View className="px-4 mb-6">
          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Text className="text-blue-600 text-lg">📊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Track Performance</Text>
                <Text className="text-gray-500 text-sm">
                  Monitor how politicians are following through on their commitments.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-lg">📝</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Explore Promises</Text>
                <Text className="text-gray-500 text-sm">
                  Get detailed information about campaign promises and their current status.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <View className="flex-row">
              <View className="h-10 w-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                <Text className="text-purple-600 text-lg">💬</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Share Feedback</Text>
                <Text className="text-gray-500 text-sm">
                  Voice your opinions and contribute to the democratic dialogue.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* How to Get Started */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-blue-600 text-lg mr-2">💡</Text>
            <Text className="text-gray-800 text-lg font-medium">How to Get Started</Text>
          </View>

          <View className="ml-2 mb-4">
            <View className="flex-row mb-3">
              <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center mr-3">
                <Text className="text-white font-bold text-xs">1</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Ask me about any politician's performance or specific policies
              </Text>
            </View>
            
            <View className="flex-row mb-3">
              <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center mr-3">
                <Text className="text-white font-bold text-xs">2</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Request updates on campaign promises and their progress
              </Text>
            </View>
            
            <View className="flex-row">
              <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center mr-3">
                <Text className="text-white font-bold text-xs">3</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Share your thoughts and feedback on political matters
              </Text>
            </View>
          </View>
        </View>

        {/* Start Chat button */}
        <View className="px-4 mb-6">
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-4 items-center flex-row justify-center"
            onPress={handleStartChat}
          >
            <Text className="text-white mr-2">💬</Text>
            <Text className="text-white font-bold">Start Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Demo and Help buttons */}
        <View className="flex-row px-4 mb-8 justify-between">
          <TouchableOpacity 
            className="flex-1 border border-gray-300 rounded-lg py-3 mr-2 items-center"
            onPress={handleDemo}
          >
            <Text className="text-gray-700 flex-row items-center">
              <Text className="mr-1">▶</Text> Demo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 border border-gray-300 rounded-lg py-3 ml-2 items-center"
            onPress={handleHelp}
          >
            <Text className="text-gray-700 flex-row items-center">
              <Text className="mr-1">❓</Text> Help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-center text-gray-500 mb-3">Quick Actions</Text>
          <View className="flex-row justify-around">
            <TouchableOpacity className="items-center">
              <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                <Text>🔍</Text>
              </View>
              <Text className="text-xs text-gray-600">Search Politicians</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center">
              <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                <Text>📰</Text>
              </View>
              <Text className="text-xs text-gray-600">Recent Updates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center">
              <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                <Text>⭐</Text>
              </View>
              <Text className="text-xs text-gray-600">Top Rated</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center">
              <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                <Text>📈</Text>
              </View>
              <Text className="text-xs text-gray-600">Trending</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mb-8">
          <Text className="text-xs text-gray-400">Powered by AI • Secure & Private</Text>
          <View className="flex-row mt-2">
            <Text className="text-gray-400 mx-1">📄</Text>
            <Text className="text-gray-400 mx-1">⚙️</Text>
            <Text className="text-gray-400 mx-1">❓</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PoliBotScreen;