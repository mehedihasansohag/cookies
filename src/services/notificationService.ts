
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/types/notification';

/**
 * Generate a unique ID for a new notification
 */
export const generateNotificationId = (): string => {
  return uuidv4();
};

/**
 * Add a new notification
 */
export const addNotification = (
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
) => {
  const now = new Date();
  
  const newNotification: Notification = {
    id: generateNotificationId(),
    ...notification,
    createdAt: now.toISOString(),
    isRead: false,
  };
  
  setNotifications([...notifications, newNotification]);
};

/**
 * Update an existing notification
 */
export const updateNotification = (
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  updatedNotification: Notification
) => {
  const updatedNotifications = notifications.map((notification) =>
    notification.id === updatedNotification.id ? updatedNotification : notification
  );
  
  setNotifications(updatedNotifications);
};

/**
 * Delete a notification
 */
export const deleteNotification = (
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  id: string
) => {
  const filteredNotifications = notifications.filter(
    (notification) => notification.id !== id
  );
  
  setNotifications(filteredNotifications);
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = (
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  id: string
) => {
  const updatedNotifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, isRead: true } : notification
  );
  
  setNotifications(updatedNotifications);
};
