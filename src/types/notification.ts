
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  createdAt: string;
  isRead: boolean;
  expiresAt?: string;
}
