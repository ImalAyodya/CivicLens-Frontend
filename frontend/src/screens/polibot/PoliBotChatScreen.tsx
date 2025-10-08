import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  FlatList
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { suggestedQueries } from '../../services/polibotLogic';
import { fetchPoliBotAIResponse } from '../../services/APIservices'; // <-- Import the API

type Props = NativeStackScreenProps<RootStackParamList, 'PoliBotChat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const PoliBotChatScreen: React.FC<Props> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm PoliBot, your political assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<FlatList>(null);

  // Function to handle sending a message
  const handleSend = async () => {
    if (message.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Fetch response from PoliBot AI API
    const botReply = await fetchPoliBotAIResponse(message);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, botMessage]);
    setIsTyping(false);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Function to handle suggested query selection
  const handleSuggestedQuery = (query: string) => {
    setMessage(query);
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-100"
    >
      {/* Header */}
      <View className="bg-white shadow-sm px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center ml-2">
            <View className="h-8 w-8 rounded-full bg-indigo-600 items-center justify-center">
              <Text className="text-white text-sm">👨‍💼</Text>
            </View>
            <View className="ml-2">
              <Text className="font-medium">PoliBot</Text>
              <View className="flex-row items-center">
                <View className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                <Text className="text-xs text-gray-500">Online</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-xl">⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <View className="flex-1">
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View 
              className={`mb-3 max-w-3/4 ${
                item.sender === 'user' ? 'self-end ml-auto' : 'self-start'
              }`}
            >
              <View 
                className={`rounded-lg p-3 ${
                  item.sender === 'user' 
                    ? 'bg-blue-600 rounded-tr-none' 
                    : 'bg-white rounded-tl-none shadow-sm'
                }`}
              >
                <Text 
                  className={`${
                    item.sender === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {item.text}
                </Text>
              </View>
              <Text className={`text-xs text-gray-500 mt-1 ${
                item.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          )}
        />
        {/* Typing indicator */}
        {isTyping && (
          <View className="flex-row items-center px-4 py-2">
            <View className="h-6 w-6 rounded-full bg-gray-200 items-center justify-center mr-2">
              <Text className="text-sm">⌛</Text>
            </View>
            <Text className="text-sm text-gray-500">PoliBot is typing...</Text>
          </View>
        )}
      </View>

      {/* Bottom section - group suggestions with input */}
      <View className="bg-white border-t border-gray-200">
        {/* Suggested queries */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          className="py-2"
        >
          {suggestedQueries.map((query, index) => (
            <TouchableOpacity 
              key={index}
              className="bg-gray-100 px-4 h-8 items-center justify-center rounded-full border border-gray-200 mr-2"
              onPress={() => handleSuggestedQuery(query)}
            >
              <Text className="text-gray-700 text-sm">{query}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View className="px-4 py-2 flex-row items-center">
          <TouchableOpacity className="mr-3">
            <Text className="text-xl text-gray-500">➕</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            placeholder="Message PoliBot..."
            value={message}
            onChangeText={setMessage}
            multiline={false}
          />
          <TouchableOpacity 
            className="h-10 w-10 rounded-full bg-blue-600 items-center justify-center"
            onPress={handleSend}
          >
            <Text className="text-white text-lg">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PoliBotChatScreen;