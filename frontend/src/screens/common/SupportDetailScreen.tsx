import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext, UserContextType } from '../../context/UserContext';
import { getSupportRequestDetails, addReplyToSupportRequest } from '../../services/APIservices';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportDetail'>;

interface Reply {
  from: string;
  message: string;
  timestamp: string;
}

interface SupportDetail {
  _id: string;
  userId: string;
  username: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Open': return 'bg-blue-100 text-blue-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Resolved': return 'bg-green-100 text-green-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

const SupportDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const { user } = useContext(UserContext) as UserContextType;
  const [supportDetail, setSupportDetail] = useState<SupportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchSupportDetail();
  }, [ticketId]);

  const fetchSupportDetail = async () => {
    try {
      setLoading(true);
      const response = await getSupportRequestDetails(ticketId);
      if (response.success) {
        setSupportDetail(response.data);
      } else {
        setError(response.message || 'Failed to fetch support request details');
      }
    } catch (err) {
      setError('An error occurred while fetching the support request details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim()) {
      Alert.alert('Empty Reply', 'Please enter a message to send.');
      return;
    }

    if (!user?.username) {
      Alert.alert('Not Logged In', 'You must be logged in to reply.');
      return;
    }

    try {
      setSendingReply(true);
      const response = await addReplyToSupportRequest(
        ticketId,
        user.username,
        newReply
      );

      if (response.success) {
        setSupportDetail(response.data);
        setNewReply('');
        Alert.alert('Reply Sent', 'Your reply has been added successfully.');
      } else {
        throw new Error(response.message || 'Failed to send reply');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send your reply. Please try again.');
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading support request details...</Text>
      </View>
    );
  }

  if (error || !supportDetail) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-lg text-center">{error || 'Support request not found'}</Text>
        <TouchableOpacity 
          className="mt-6 bg-blue-600 py-3 px-6 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isResolved = supportDetail.status === 'Resolved' || supportDetail.status === 'Closed';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <View className="flex-1 bg-gray-50">
        <View className="bg-blue-600 py-6 px-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold ml-4">Support Request</Text>
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4">
            {/* Request Header */}
            <View className="bg-white rounded-lg p-4 mb-4">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-bold text-xl flex-1 pr-2">{supportDetail.subject}</Text>
                <View className={`rounded-full px-3 py-1 ${getStatusColor(supportDetail.status)}`}>
                  <Text className="font-medium">{supportDetail.status}</Text>
                </View>
              </View>
              <Text className="text-gray-600 mb-2">Category: {supportDetail.category}</Text>
              <Text className="text-gray-500 text-sm">Ticket ID: {supportDetail._id}</Text>
              <Text className="text-gray-500 text-sm">Created: {formatDate(supportDetail.createdAt)}</Text>
            </View>

            {/* Original Message */}
            <View className="bg-white rounded-lg p-4 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-bold">Original Message</Text>
                <Text className="text-gray-500 text-sm">{formatDate(supportDetail.createdAt)}</Text>
              </View>
              <View className="bg-gray-50 p-3 rounded-lg">
                <Text className="text-gray-800">{supportDetail.message}</Text>
              </View>
            </View>

            {/* Replies */}
            {supportDetail.replies && supportDetail.replies.length > 0 && (
              <View className="bg-white rounded-lg p-4 mb-4">
                <Text className="font-bold mb-3">Replies</Text>
                {supportDetail.replies.map((reply, index) => (
                  <View key={index} className="mb-4 last:mb-0">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-medium">{reply.from}</Text>
                      <Text className="text-gray-500 text-sm">{formatDate(reply.timestamp)}</Text>
                    </View>
                    <View className={`p-3 rounded-lg ${reply.from === 'Admin' || reply.from === 'Support Team' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <Text className="text-gray-800">{reply.message}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Reply Box */}
            {!isResolved && (
              <View className="bg-white rounded-lg p-4 mb-4">
                <Text className="font-bold mb-3">Add Reply</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3"
                  value={newReply}
                  onChangeText={setNewReply}
                  placeholder="Type your reply here..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  className={`bg-blue-600 py-3 rounded-lg ${sendingReply ? 'opacity-70' : ''}`}
                  onPress={handleSendReply}
                  disabled={sendingReply}
                >
                  {sendingReply ? (
                    <View className="flex-row justify-center items-center">
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-white font-medium ml-2">Sending...</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-medium text-center">Send Reply</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Info Box */}
            {isResolved && (
              <View className="bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={24} color="#3b82f6" />
                  <Text className="ml-2 text-gray-800">
                    This support request has been {supportDetail.status.toLowerCase()}. If you need further assistance, 
                    please create a new request.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SupportDetailScreen;