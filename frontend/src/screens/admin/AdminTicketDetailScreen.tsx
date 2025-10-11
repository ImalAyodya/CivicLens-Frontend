import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AdminLayout from '../../components/admin/AdminLayout';
import { getTicketDetails, updateTicketStatus, addAdminReply, deleteTicket } from '../../services/AdminApiService';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminTicketDetail'>;

interface Reply {
  _id: string;
  from: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

interface TicketDetail {
  _id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

const AdminTicketDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTicketDetails(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Failed to load ticket details');
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !ticket) return;
    
    try {
      setIsSending(true);
      const response = await addAdminReply(ticketId, replyText.trim());
      
      // Update the ticket with the new reply
      setTicket(response.ticket);
      setReplyText('');
      setSelectedStatus(response.ticket.status);
      setIsSending(false);
    } catch (err) {
      console.error('Error sending reply:', err);
      Alert.alert('Error', 'Failed to send reply. Please try again.');
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!ticket || status === ticket.status || isUpdating) return;
    
    try {
      setIsUpdating(true);
      const updatedTicket = await updateTicketStatus(ticketId, status);
      setTicket(updatedTicket);
      setSelectedStatus(status);
      setIsUpdating(false);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      Alert.alert('Error', 'Failed to update ticket status');
      setIsUpdating(false);
    }
  };

  const handleDeleteTicket = () => {
    Alert.alert(
      'Delete Ticket',
      'Are you sure you want to delete this ticket? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTicket(ticketId);
              navigation.goBack();
              // Show success message after navigation
              setTimeout(() => {
                Alert.alert('Success', 'Ticket deleted successfully');
              }, 500);
            } catch (err) {
              console.error('Error deleting ticket:', err);
              Alert.alert('Error', 'Failed to delete ticket');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#EF4444';
      case 'In Progress':
        return '#F59E0B';
      case 'Resolved':
        return '#10B981';
      case 'Closed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '#DC2626';
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#F59E0B';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Ticket Details" activeScreen="support">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-3 text-slate-500">Loading ticket details...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Ticket Details" activeScreen="support">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="mt-3 text-slate-500 text-base">{error}</Text>
          <TouchableOpacity 
            className="mt-5 bg-blue-600 px-4 py-2 rounded-lg"
            onPress={fetchTicketDetails}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="mt-3 flex-row items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#2563EB" />
            <Text className="text-blue-600 ml-1 font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout title="Ticket Details" activeScreen="support">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-slate-500 text-base mt-3 mb-5">Ticket not found</Text>
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-blue-600 ml-1 font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ticket Details" activeScreen="support">
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#2563EB" />
            <Text className="text-blue-600 ml-1 text-sm">All Tickets</Text>
          </TouchableOpacity>
          
          <View className="flex-row">
            <TouchableOpacity 
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center ml-2"
              onPress={handleDeleteTicket}
            >
              <Ionicons name="trash-outline" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center ml-2">
              <Ionicons name="mail-outline" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center ml-2">
              <Ionicons name="print-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView className="flex-1">
          {/* Ticket Info */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-lg font-bold text-slate-800 mb-2">{ticket.subject}</Text>
            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500">Ticket #{ticket._id}</Text>
              <Text className="text-xs text-slate-500">Created: {formatDate(ticket.createdAt)}</Text>
            </View>
          </View>
          
          {/* Ticket Details & Actions */}
          <View className="bg-white rounded-lg p-4 mb-4 flex-row">
            <View className="flex-1">
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">Status</Text>
                <View 
                  style={{ backgroundColor: `${getStatusColor(ticket.status)}20` }}
                  className="flex-row items-center px-2 py-1 rounded self-start"
                >
                  <View 
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                    className="w-2 h-2 rounded-full mr-1"
                  />
                  <Text 
                    style={{ color: getStatusColor(ticket.status) }}
                    className="text-xs font-medium"
                  >
                    {ticket.status}
                  </Text>
                </View>
              </View>
              
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">Priority</Text>
                <View 
                  style={{ backgroundColor: `${getPriorityColor(ticket.priority)}20` }}
                  className="px-2 py-1 rounded self-start"
                >
                  <Text 
                    style={{ color: getPriorityColor(ticket.priority) }}
                    className="text-xs font-medium"
                  >
                    {ticket.priority}
                  </Text>
                </View>
              </View>
              
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">Category</Text>
                <Text className="text-sm text-slate-800">{ticket.category}</Text>
              </View>
            </View>
            
            <View className="flex-1">
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">User</Text>
                <Text className="text-sm text-slate-800">{ticket.username}</Text>
              </View>
              
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">Email</Text>
                <Text className="text-sm text-slate-800">{ticket.email}</Text>
              </View>
              
              <View className="mb-3">
                <Text className="text-xs text-slate-400 mb-1">Last Update</Text>
                <Text className="text-sm text-slate-800">{formatDate(ticket.updatedAt)}</Text>
              </View>
            </View>
          </View>
          
          {/* Update Status */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-semibold text-slate-800 mb-3">Update Status</Text>
            <View className="flex-row flex-wrap">
              {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={selectedStatus === status ? {
                    backgroundColor: getStatusColor(status),
                    borderColor: getStatusColor(status)
                  } : {}}
                  className={`px-3 py-2 rounded border border-slate-200 mr-2 mb-2 ${
                    selectedStatus === status ? 'border-transparent' : ''
                  }`}
                  onPress={() => handleUpdateStatus(status)}
                  disabled={isUpdating}
                >
                  {isUpdating && selectedStatus === status ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text 
                      className={`text-sm font-medium ${
                        selectedStatus === status ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {status}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Original Message */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-semibold text-slate-800 mb-3">Original Message</Text>
            <View className="bg-slate-50 rounded-lg p-3">
              <View className="mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                    <Text className="text-blue-600 font-semibold">{ticket.username.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="font-medium text-slate-800">{ticket.username}</Text>
                    <Text className="text-xs text-slate-500">{formatDate(ticket.createdAt)}</Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm text-slate-700">{ticket.message}</Text>
            </View>
          </View>
          
          {/* Conversation */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-semibold text-slate-800 mb-3">Conversation</Text>
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply) => (
                <View 
                  key={reply._id} 
                  className={`mb-3 p-3 rounded-lg ${
                    reply.isAdmin ? 'bg-blue-50' : 'bg-slate-50'
                  }`}
                >
                  <View className="mb-2">
                    <View className="flex-row items-center">
                      <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                        reply.isAdmin ? 'bg-blue-600' : 'bg-blue-100'
                      }`}>
                        <Text className={`font-semibold ${
                          reply.isAdmin ? 'text-white' : 'text-blue-600'
                        }`}>
                          {reply.from.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-medium text-slate-800">{reply.from}</Text>
                        <Text className="text-xs text-slate-500">{formatDate(reply.timestamp)}</Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-sm text-slate-700">{reply.message}</Text>
                </View>
              ))
            ) : (
              <View className="bg-slate-50 p-4 rounded-lg items-center">
                <Text className="text-gray-500">No replies yet</Text>
              </View>
            )}
          </View>
          
          {/* Reply Form */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-semibold text-slate-800 mb-3">Add Reply</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 bg-slate-50 mb-3 text-slate-800 h-24"
              multiline
              placeholder="Type your response here..."
              placeholderTextColor="#94a3b8"
              value={replyText}
              onChangeText={setReplyText}
              textAlignVertical="top"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity className="p-2 mr-2">
                <Ionicons name="attach" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity 
                className={`bg-blue-600 px-4 py-2 rounded-lg flex-row items-center ${
                  (!replyText.trim() || isSending) ? 'opacity-60' : ''
                }`}
                onPress={handleSendReply}
                disabled={!replyText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="white" />
                    <Text className="text-white font-medium ml-1">Send Reply</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </AdminLayout>
  );
};

export default AdminTicketDetailScreen;