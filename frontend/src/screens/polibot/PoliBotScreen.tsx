import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import BlueHeader from '../../components/BlueHeader';

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
      <BlueHeader title="PoliBot" onBack={() => navigation.goBack()} />

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
      </ScrollView>
    </View>
  );
};

export default PoliBotScreen;