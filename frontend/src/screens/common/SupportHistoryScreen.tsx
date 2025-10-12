import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import { getUserSupportRequests } from '../../services/APIservices';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import BlueHeader from '../../components/BlueHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportHistory'>;

interface SupportRequest {
  _id: string;
  subject: string;
  category: string;
  status: string;
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

const SupportHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    if (!user?.id) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserSupportRequests(user.id);
      if (response.success) {
        setSupportRequests(response.data);
      } else {
        setError(response.message || 'Failed to fetch support requests');
      }
    } catch (err) {
      setError('An error occurred while fetching your support history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSupportItem = ({ item }: { item: SupportRequest }) => (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
      onPress={() => navigation.navigate('SupportDetail', { ticketId: item._id })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-semibold text-lg" numberOfLines={1}>{item.subject}</Text>
          <Text className="text-gray-600 mt-1">Category: {item.category}</Text>
          <Text className="text-gray-500 text-sm mt-2">
            Created: {formatDate(item.createdAt)}
          </Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${getStatusColor(item.status)}`}>
          <Text className="font-medium">{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading your support history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-lg text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-6 bg-blue-600 py-3 px-6 rounded-lg"
          onPress={fetchSupportRequests}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <BlueHeader title="Support History" onBack={() => navigation.goBack()} />

      <View className="p-4 flex-1">
        {supportRequests.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="chatbox-outline" size={64} color="#94a3b8" />
            <Text className="mt-4 text-lg text-gray-600 text-center">
              You haven't submitted any support requests yet.
            </Text>
            <TouchableOpacity
              className="mt-6 bg-blue-600 py-3 px-6 rounded-lg"
              onPress={() => navigation.navigate('HelpAndSupport')}
            >
              <Text className="text-white font-medium">Create New Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={supportRequests}
              keyExtractor={(item) => item._id}
              renderItem={renderSupportItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity
              className="mt-4 py-3 px-4 bg-blue-600 rounded-lg"
              onPress={() => navigation.navigate('HelpAndSupport')}
            >
              <Text className="text-white font-medium text-center">Create New Request</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default SupportHistoryScreen;