import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminDashboardStats, getAllSupportTickets } from '../../services/AdminApiService';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

interface StatCard {
  id: string;
  title: string;
  value: string;
  change?: string;
  icon: string;
  color: string;
  isUp?: boolean;
}

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  username: string;
  status: string;
  priority: string;
  createdAt: string;
}

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const windowWidth = Dimensions.get('window').width;
      setIsMobile(windowWidth < 768);
    };
    
    checkScreenSize();
    const dimensionListener = Dimensions.addEventListener('change', checkScreenSize);
    
    // Clean up
    return () => {
      if (dimensionListener?.remove) {
        dimensionListener.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const data = await getAdminDashboardStats();
        setStats(data);
        setStatsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
        setStatsLoading(false);
      }
    };

    const fetchRecentTickets = async () => {
      try {
        setTicketsLoading(true);
        const tickets = await getAllSupportTickets();
        // Get only the 5 most recent tickets
        setRecentTickets(tickets.slice(0, 5));
        setTicketsLoading(false);
      } catch (err) {
        console.error('Error fetching recent tickets:', err);
        setError('Failed to load recent tickets');
        setTicketsLoading(false);
      }
    };

    fetchDashboardStats();
    fetchRecentTickets();

    // Set overall loading state based on individual loading states
    setIsLoading(statsLoading || ticketsLoading);
  }, []);

  // When both API calls are complete, update overall loading state
  useEffect(() => {
    if (!statsLoading && !ticketsLoading) {
      setIsLoading(false);
    }
  }, [statsLoading, ticketsLoading]);

  const getStatCards = (): StatCard[] => {
    if (!stats) return [];

    return [
      {
        id: '1',
        title: 'Open Tickets',
        value: stats.openTickets.toString(),
        icon: 'alert-circle',
        color: '#2563EB',
      },
      {
        id: '2',
        title: 'Resolved Today',
        value: stats.resolvedToday.toString(),
        icon: 'checkmark-circle',
        color: '#10B981',
      },
      {
        id: '3',
        title: 'Total Tickets',
        value: stats.totalTickets.toString(),
        icon: 'people',
        color: '#F59E0B',
      },
      {
        id: '4',
        title: 'Response Time',
        value: stats.responseTime,
        icon: 'time',
        color: '#6366F1',
      },
    ];
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

  // Adjust card width based on screen size
  const cardWidth = isMobile ? "w-full mb-3" : "w-[48%] mb-4";

  if (error) {
    return (
      <AdminLayout title="Dashboard" activeScreen="dashboard">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
            onPress={() => navigation.replace('AdminDashboard')}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" activeScreen="dashboard">
      <ScrollView className="flex-1">
        {/* Stats Overview */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {statsLoading ? (
            <View className="w-full flex-row justify-center py-8">
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            getStatCards().map(card => (
              <View 
                key={card.id} 
                className={`bg-white rounded-lg p-4 shadow-sm ${cardWidth}`}
              >
                <View className={`w-[42px] h-[42px] rounded-full items-center justify-center mb-3`} style={{ backgroundColor: `${card.color}20` }}>
                  <Ionicons name={card.icon as any} size={22} color={card.color} />
                </View>
                <Text className="text-sm text-gray-500 mb-1">{card.title}</Text>
                <Text className="text-2xl font-bold text-gray-800 mb-1">{card.value}</Text>
                {card.change && (
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={card.isUp ? 'arrow-up-outline' : 'arrow-down-outline'} 
                      size={14} 
                      color={card.isUp ? '#10B981' : '#EF4444'} 
                    />
                    <Text className="text-xs ml-0.5" style={{ color: card.isUp ? '#10B981' : '#EF4444' }}>
                      {card.change}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Recent Tickets */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Recent Support Tickets</Text>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => navigation.navigate('AdminSupportTickets')}
            >
              <Text className="text-sm text-blue-600 mr-0.5">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {ticketsLoading ? (
            <View className="bg-white rounded-lg p-6 items-center justify-center">
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="mt-3 text-gray-500">Loading recent tickets...</Text>
            </View>
          ) : recentTickets.length === 0 ? (
            <View className="bg-white rounded-lg p-6 items-center justify-center">
              <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
              <Text className="mt-3 text-gray-500">No tickets found</Text>
            </View>
          ) : (
            <View className="bg-white rounded-lg overflow-hidden shadow-sm">
              {recentTickets.map((ticket) => (
                <TouchableOpacity
                  key={ticket._id}
                  className="p-4 border-b border-gray-200"
                  onPress={() => viewTicketDetails(ticket._id)}
                >
                  <View className="flex-row justify-between mb-2">
                    <View className="bg-gray-100 px-2 py-0.5 rounded">
                      <Text className="text-xs text-gray-500">{ticket.category}</Text>
                    </View>
                    <Text className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-800 mb-1">{ticket.subject}</Text>
                  <Text className="text-sm text-gray-500 mb-2">From: {ticket.username}</Text>
                  <View className="flex-row">
                    <View 
                      className="flex-row items-center px-2 py-1 rounded mr-2"
                      style={{ backgroundColor: `${getStatusColor(ticket.status)}20` }}
                    >
                      <View 
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: getStatusColor(ticket.status) }} 
                      />
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: getStatusColor(ticket.status) }}
                      >
                        {ticket.status}
                      </Text>
                    </View>
                    <View 
                      className="px-2 py-1 rounded"
                      style={{ backgroundColor: `${getPriorityColor(ticket.priority)}20` }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: getPriorityColor(ticket.priority) }}
                      >
                        {ticket.priority}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap mt-2">
            <TouchableOpacity 
              className={`bg-white rounded-lg p-4 flex-row items-center shadow-sm ${isMobile ? 'w-full mb-3' : 'w-[48%] mb-4 mr-[4%]'}`}
              onPress={() => navigation.navigate('AdminSupportTickets')}
            >
              <Ionicons name="help-buoy-outline" size={22} color="#2563EB" />
              <Text className="ml-2 text-sm text-gray-800 font-medium">View All Tickets</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`bg-white rounded-lg p-4 flex-row items-center shadow-sm ${isMobile ? 'w-full mb-3' : 'w-[48%] mb-4'}`}
              onPress={() => navigation.navigate('AdminResolvedTickets')}
            >
              <Ionicons name="checkmark-done-outline" size={22} color="#2563EB" />
              <Text className="ml-2 text-sm text-gray-800 font-medium">View Resolved</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
};

export default AdminDashboardScreen;