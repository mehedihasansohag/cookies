
import { useState } from 'react';
import { Notification } from '@/types/notification';
import { useLocalStorage } from '../useLocalStorage';
import { 
  addNotification as addNotificationService,
  updateNotification as updateNotificationService,
  deleteNotification as deleteNotificationService,
  markNotificationAsRead as markNotificationAsReadService
} from '@/services/notificationService';

export const useNotificationProvider = () => {
  const [storedNotifications, setStoredNotifications] = useLocalStorage<Notification[]>(
    'accessVaultNotifications',
    []
  );
  const [notifications, setNotifications] = useState<Notification[]>(storedNotifications);

  // Custom setter that updates both state and localStorage
  const updateNotificationsState = (newNotifications: Notification[] | ((prev: Notification[]) => Notification[])) => {
    setNotifications(newNotifications);
    setStoredNotifications(typeof newNotifications === 'function' ? newNotifications(notifications) : newNotifications);
  };

  // Add a notification
  const addNotification = (
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ) => {
    addNotificationService(
      notifications,
      updateNotificationsState,
      notification
    );
  };

  // Update a notification
  const updateNotification = (notification: Notification) => {
    updateNotificationService(
      notifications,
      updateNotificationsState,
      notification
    );
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    deleteNotificationService(
      notifications,
      updateNotificationsState,
      id
    );
  };

  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    markNotificationAsReadService(
      notifications,
      updateNotificationsState,
      id
    );
  };

  return {
    notifications,
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
  };
};
