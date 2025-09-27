import { useState, useEffect } from 'react';
import type { Notification } from '../types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Urgent: New Policy Bill Passed',
            description: 'Healthcare reform bill approved by parliament with 76% majority vote',
            timestamp: 'Just now',
            type: 'alert',
            priority: 'urgent',
            read: false,
            icon: '🔔',
            color: '#FF4C3F'
          },
          {
            id: '2',
            title: 'Breaking: Presidential Debate Tonight',
            description: 'Live coverage starts at 8 PM on national television',
            timestamp: '30 min ago',
            type: 'event',
            priority: 'high',
            read: false,
            icon: '📺',
            color: '#FFA726'
          },
          {
            id: '3',
            title: 'Election in 42 days',
            description: 'Presidential Election 2024',
            timestamp: '1 hour ago',
            type: 'event',
            priority: 'high',
            read: false,
            count: 42,
            icon: '🗳️',
            color: '#3F88FF'
          },
          {
            id: '4',
            title: 'Daily Election Fact',
            description: 'Did you know? Only 70% of eligible voters participated in the last presidential election in Sri Lanka.',
            timestamp: '2 hours ago',
            type: 'fact',
            priority: 'medium',
            read: true,
            icon: 'ℹ️',
            color: '#5BB0F8'
          },
          {
            id: '5',
            title: 'Promise Fulfilled: Education Budget',
            description: 'Government increased education budget by 15% as promised during campaign',
            timestamp: '2 hours ago',
            type: 'promise',
            priority: 'medium',
            read: true,
            icon: '✅',
            color: '#4CAF50'
          },
          {
            id: '6',
            title: 'Parliament Debate Update',
            description: 'Infrastructure development bill under discussion in parliament',
            timestamp: '4 hours ago',
            type: 'update',
            priority: 'medium',
            read: true,
            icon: 'ℹ️',
            color: '#42A5F5'
          },
          {
            id: '7',
            title: 'New Law Passed',
            description: 'Anti-corruption legislation approved with bipartisan support',
            timestamp: '1 day ago',
            type: 'law',
            priority: 'medium',
            read: true,
            icon: '⚖️',
            color: '#AB47BC'
          },
          {
            id: '8',
            title: 'Performance Update',
            description: 'Economic growth rate reaches 4.2% this quarter',
            timestamp: '2 days ago',
            type: 'performance',
            priority: 'low',
            read: true,
            icon: '📊',
            color: '#FFC107'
          },
          {
            id: '9',
            title: 'Public Opinion Poll',
            description: 'Latest approval ratings show significant shifts in voter preferences',
            timestamp: '3 days ago',
            type: 'poll',
            priority: 'low',
            read: true,
            icon: '📊',
            color: '#FF5252'
          },
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    loading,
    error,
    notificationsEnabled,
    toggleNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  };
}