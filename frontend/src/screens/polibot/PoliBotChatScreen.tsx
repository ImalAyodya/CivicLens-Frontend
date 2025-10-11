import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  Modal
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { suggestedQueries } from '../../services/polibotLogic';
import { fetchPoliBotAIResponse } from '../../services/APIservices';
import { Ionicons } from '@expo/vector-icons';
import BlueHeader from '../../components/BlueHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'PoliBotChat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

const languages: Language[] = [
  { id: '1', name: 'English', code: 'en' },
  { id: '2', name: 'සිංහල', code: 'si' },
  { id: '3', name: 'தமிழ்', code: 'ta' }
];

const welcomeMessages = {
  en: "Hello! I'm PoliBot, your political assistant. How can I help you today?",
  si: "ආයුබෝවන්! මම පොලිබොට්, ඔබේ දේශපාලන සහායකයා. මට අද ඔබට උදව් කළ හැක්කේ කෙසේද?",
  ta: "வணக்கம்! நான் போலிபாட், உங்கள் அரசியல் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
};

const placeholders = {
  en: "Message PoliBot...",
  si: "පොලිබොට් වෙත පණිවුඩයක් යවන්න...",
  ta: "போலிபாட்டுக்கு செய்தி அனுப்பவும்..."
};

const typingIndicators = {
  en: "PoliBot is typing...",
  si: "පොලිබොට් ටයිප් කරමින් සිටී...",
  ta: "போலிபாட் தட்டச்சு செய்கிறது..."
};

const PoliBotChatScreen: React.FC<Props> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: welcomeMessages[selectedLanguage.code as keyof typeof welcomeMessages],
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<FlatList>(null);

  // Update welcome message when language changes
  useEffect(() => {
    const welcomeMessage = welcomeMessages[selectedLanguage.code as keyof typeof welcomeMessages];
    setMessages([
      {
        id: '1',
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [selectedLanguage]);

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

    try {
      // Pass language code to the API
      const botReply = await fetchPoliBotAIResponse(message, selectedLanguage.code);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error getting bot reply:', error);
      // Show error message in selected language
      const errorMessages = {
        en: "Sorry, I couldn't process your request right now.",
        si: "සමාවෙන්න, මට දැන් ඔබේ ඉල්ලීම සැකසිය නොහැක.",
        ta: "மன்னிக்கவும், எனக்கு இப்போது உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை."
      };
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessages[selectedLanguage.code as keyof typeof errorMessages],
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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

  // Function to change language
  const changeLanguage = (language: Language) => {
    setSelectedLanguage(language);
    setLanguageModalVisible(false);
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
      <BlueHeader 
        title="PoliBot" 
        onBack={() => navigation.goBack()} 
        rightIcon={
          <TouchableOpacity 
            onPress={() => setLanguageModalVisible(true)}
            className="flex-row items-center"
          >
            <Ionicons name="globe-outline" size={22} color="white" />
            <Text className="text-white ml-1">{selectedLanguage.name}</Text>
          </TouchableOpacity>
        }
      />

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View className="bg-white rounded-lg p-4 w-3/4 max-w-sm">
            <Text className="text-lg font-bold text-center mb-4">Select Language</Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                className={`p-3 rounded-lg mb-2 ${
                  selectedLanguage.id === language.id 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'border border-gray-200'
                }`}
                onPress={() => changeLanguage(language)}
              >
                <Text 
                  className={`text-center font-medium ${
                    selectedLanguage.id === language.id ? 'text-blue-700' : 'text-gray-800'
                  }`}
                >
                  {language.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
              <Ionicons name="ellipsis-horizontal" size={18} color="#555" />
            </View>
            <Text className="text-sm text-gray-500">
              {typingIndicators[selectedLanguage.code as keyof typeof typingIndicators]}
            </Text>
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
          <TouchableOpacity 
            className="mr-3"
            onPress={() => setLanguageModalVisible(true)}
          >
            <Ionicons name="globe-outline" size={24} color="#555" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            placeholder={placeholders[selectedLanguage.code as keyof typeof placeholders]}
            value={message}
            onChangeText={setMessage}
            multiline={false}
          />
          <TouchableOpacity 
            className="h-10 w-10 rounded-full bg-blue-600 items-center justify-center"
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PoliBotChatScreen;