import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext, UserContextType } from '../../context/UserContext';
import { submitSupportRequest } from '../../services/APIservices';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpAndSupport'>;

const supportCategories = [
  'General Inquiry',
  'Technical Issue',
  'Feature Request',
  'Data Correction',
  'Other'
];

const HelpAndSupportScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useContext(UserContext) as UserContextType;
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Ref to track if component is mounted (to avoid state updates after unmount)
  const isMounted = useRef(true);
  
  // Set up cleanup for the ref when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    // Validate fields
    if (!email || !subject || !message) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Set up a timeout to reset the loading state after 5 seconds
      const timeoutId = setTimeout(() => {
        if (isMounted.current) {
          setIsSubmitting(false);
        }
      }, 5000);
      
      const response = await submitSupportRequest({
        userId: user?.id || 'guest',
        username: user?.username || 'Guest User',
        email,
        subject,
        message,
        category
      });
      
      // Clear the timeout if the request completes before 5 seconds
      clearTimeout(timeoutId);
      
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      setIsSubmitting(false);

      if (response.success) {
        Alert.alert(
          'Support Request Submitted',
          `Thank you for reaching out. Your ticket ID is: ${response.ticketId}. We'll get back to you as soon as possible.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setSubject('');
                setMessage('');
                setCategory('General Inquiry');
                
                // Navigate to support history if user is logged in
                if (user?.id) {
                  navigation.navigate('SupportHistory');
                }
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsSubmitting(false);
        Alert.alert(
          'Error',
          'There was a problem submitting your request. Please try again later.'
        );
      }
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const toggleFAQs = () => {
    setShowFAQs(!showFAQs);
  };

  const renderFAQs = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <Text className="font-bold text-lg mb-4">Frequently Asked Questions</Text>

      <View className="mb-4">
        <Text className="font-semibold text-blue-600 mb-1">
          How is politician performance calculated?
        </Text>
        <Text className="text-gray-700">
          Our performance scores are calculated based on promise fulfillment rates, public approval ratings, 
          and legislative effectiveness metrics gathered from official government sources and reliable polls.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="font-semibold text-blue-600 mb-1">
          How often is the data updated?
        </Text>
        <Text className="text-gray-700">
          We update politician performance data monthly, with promise status updates as they become available 
          through official announcements and verified media reports.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="font-semibold text-blue-600 mb-1">
          Can I suggest a politician to be added?
        </Text>
        <Text className="text-gray-700">
          Yes! Please use the support form below with the category 'Feature Request' and provide details about 
          the politician you'd like us to add.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="font-semibold text-blue-600 mb-1">
          How do I report incorrect information?
        </Text>
        <Text className="text-gray-700">
          Use the support form with the 'Data Correction' category. Please include specific details about 
          the information you believe is incorrect and any sources that support your correction.
        </Text>
      </View>

      <View>
        <Text className="font-semibold text-blue-600 mb-1">
          Is there a mobile app available?
        </Text>
        <Text className="text-gray-700">
          Yes, CivicLens is available as a mobile app for both iOS and Android platforms. You can download 
          it from the respective app stores.
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-gray-50">
        {/* Back button header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingVertical: 18, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>Help & Support</Text>
        </View>

        <View className="p-4">
          {/* Toggle FAQs */}
          <TouchableOpacity 
            className="bg-white rounded-lg p-4 mb-4 flex-row items-center justify-between"
            onPress={toggleFAQs}
          >
            <Text className="font-bold text-lg">Frequently Asked Questions</Text>
            <Ionicons 
              name={showFAQs ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#2563eb" 
            />
          </TouchableOpacity>

          {/* Render FAQs if expanded */}
          {showFAQs && renderFAQs()}

          {/* Support Request Form */}
          <View className="bg-white rounded-lg p-4">
            <Text className="font-bold text-lg mb-4">Contact Support</Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="font-medium text-gray-700 mb-1">Email Address <Text className="text-red-500">*</Text></Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={email}
                onChangeText={setEmail}
                placeholder="Your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Category Picker */}
            <View className="mb-4">
              <Text className="font-medium text-gray-700 mb-1">Category</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  backgroundColor: '#f1f5f9',
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setDropdownVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#374151', fontSize: 16 }}>{category}</Text>
                <Ionicons name="chevron-down" size={20} color="#2563eb" />
              </TouchableOpacity>

              <Modal
                visible={dropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
              >
                <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                  <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <View style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      width: 300,
                      paddingVertical: 8,
                      elevation: 5
                    }}>
                      {supportCategories.map(cat => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => {
                            setCategory(cat);
                            setDropdownVisible(false);
                          }}
                          style={{
                            paddingVertical: 14,
                            paddingHorizontal: 20,
                            borderBottomWidth: cat !== supportCategories[supportCategories.length - 1] ? 1 : 0,
                            borderBottomColor: '#e5e7eb'
                          }}
                        >
                          <Text style={{
                            color: cat === category ? '#2563eb' : '#374151',
                            fontWeight: cat === category ? 'bold' : 'normal',
                            fontSize: 16
                          }}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>

            {/* Subject Input */}
            <View className="mb-4">
              <Text className="font-medium text-gray-700 mb-1">Subject <Text className="text-red-500">*</Text></Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your inquiry"
              />
            </View>

            {/* Message Input */}
            <View className="mb-6">
              <Text className="font-medium text-gray-700 mb-1">Message <Text className="text-red-500">*</Text></Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={message}
                onChangeText={setMessage}
                placeholder="Please provide details about your inquiry or issue"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-blue-600 py-3 px-4 rounded-lg ${isSubmitting ? 'opacity-70' : ''}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-medium ml-2">Submitting...</Text>
                </View>
              ) : (
                <Text className="text-white font-medium text-center">Submit Request</Text>
              )}
            </TouchableOpacity>

            {/* View Support History */}
            {user?.id && (
              <TouchableOpacity
                className="mt-4 py-3 px-4 border border-blue-600 rounded-lg"
                onPress={() => navigation.navigate('SupportHistory')}
              >
                <Text className="text-blue-600 font-medium text-center">View Support History</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
  }
});

export default HelpAndSupportScreen;