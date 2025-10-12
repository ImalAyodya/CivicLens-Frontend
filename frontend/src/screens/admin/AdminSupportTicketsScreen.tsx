import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllSupportTickets } from '../../services/AdminApiService';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminSupportTickets'>;

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  username: string;
  email: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const AdminSupportTicketsScreen: React.FC<Props> = ({ navigation }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build params object based on statusFilter
      const params: { status?: string } = {};
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }

      const data = await getAllSupportTickets(params);
      setTickets(data);
      setFilteredTickets(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError('Failed to load support tickets');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters when search query or status filter changes
    let result = tickets;
    
    if (searchQuery) {
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ticket.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'All') {
      // If we already filtered by status in the API, no need to filter again
      // This only applies when searching within a status filter
      if (searchQuery) {
        result = result.filter(ticket => ticket.status === statusFilter);
      }
    }
    
    setFilteredTickets(result);
  }, [searchQuery, tickets]);

  // When status filter changes, fetch new data from API
  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const viewTicketDetails = (ticketId: string) => {
    navigation.navigate('AdminTicketDetail', { ticketId });
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200" 
      onPress={() => viewTicketDetails(item._id)}
    >
      <View className="flex-row justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1">{item.subject}</Text>
          <Text className="text-sm text-gray-500">{item.username}</Text>
        </View>
        
        <View 
          className="flex-row items-center px-2 py-1 rounded"
          style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
        >
          <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: getStatusColor(item.status) }} />
          <Text className="text-xs font-medium" style={{ color: getStatusColor(item.status) }}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View className="pt-3 border-t border-gray-200">
        <View className="flex-row items-center mb-2">
          <Text className="w-[70px] text-xs text-gray-500">Category:</Text>
          <Text className="text-xs text-gray-800">{item.category}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Text className="w-[70px] text-xs text-gray-500">Priority:</Text>
          <View 
            className="px-2 py-0.5 rounded"
            style={{ backgroundColor: `${getPriorityColor(item.priority)}20` }}
          >
            <Text className="text-xs font-medium" style={{ color: getPriorityColor(item.priority) }}>
              {item.priority}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <Text className="w-[70px] text-xs text-gray-500">Created:</Text>
          <Text className="text-xs text-gray-800">{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <AdminLayout title="Support Tickets" activeScreen="support">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
            onPress={fetchTickets}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Support Tickets" activeScreen="support">
      <View className="flex-1">
        <View className="mb-4">
          <View className="flex-row items-center bg-white rounded-lg px-3 py-2.5 mb-3">
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput 
              className="flex-1 text-sm text-gray-800 ml-2 p-0"
              placeholder="Search tickets..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <View className="flex-row flex-wrap">
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
              <TouchableOpacity 
                key={status}
                className={`px-3 py-1.5 bg-gray-100 rounded-full mr-2 mb-2 ${
                  statusFilter === status ? 'bg-blue-600' : ''
                }`}
                onPress={() => setStatusFilter(status)}
              >
                <Text className={`text-xs ${
                  statusFilter === status ? 'text-white' : 'text-gray-500'
                }`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View className="flex-1 bg-white rounded-lg overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">
              {filteredTickets.length} {filteredTickets.length === 1 ? 'Ticket' : 'Tickets'} Found
            </Text>
            <TouchableOpacity 
              className="flex-row items-center bg-blue-600 rounded-md px-3 py-2"
              onPress={() => navigation.navigate('AdminNewTicket')}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white text-sm font-medium ml-1">New Ticket</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View className="p-10 items-center justify-center">
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="mt-3 text-gray-500">Loading tickets...</Text>
            </View>
          ) : filteredTickets.length === 0 ? (
            <View className="p-10 items-center justify-center">
              <Ionicons name="alert-circle-outline" size={48} color="#94a3b8" />
              <Text className="text-base font-semibold text-gray-500 mt-3">No tickets found</Text>
              <Text className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTickets}
              keyExtractor={(item) => item._id}
              renderItem={renderTicketItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{padding: 12}}
            />
          )}
        </View>
      </View>
    </AdminLayout>
  );
};

export default AdminSupportTicketsScreen;