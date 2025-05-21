
import { useState } from 'react';
import { Notification } from '@/types/notification';
import notificationApi from '@/services/api/notificationApi';

export const useNotificationData = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification methods
  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      const newNotification = await notificationApi.create(notification);
      setNotifications([...notifications, newNotification]);
      return newNotification;
    } catch (error) {
      console.error('Failed to add notification:', error);
      throw error;
    }
  };

  const updateNotification = async (notification: Notification) => {
    // Not directly implemented in API, we're using markAsRead for now
    return notification;
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationApi.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const updatedNotification = await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? updatedNotification : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  return {
    notifications,
    setNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead
  };
};
