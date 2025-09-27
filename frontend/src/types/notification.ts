export type NotificationPriority = 'urgent' | 'high' | 'medium' | 'low' | 'info';

export type NotificationType = 
  | 'alert'
  | 'event'
  | 'fact'
  | 'update'
  | 'poll'
  | 'law'
  | 'performance'
  | 'promise';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO string or relative time like "2 hours ago"
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  count?: number; // For badges/counters
  icon?: string; // For different notification types
  color?: string; // Custom color for the notification
}