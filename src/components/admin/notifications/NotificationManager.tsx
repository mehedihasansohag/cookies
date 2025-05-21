
import React from 'react';
import { useData } from '@/hooks/useData';
import { NotificationForm } from './NotificationForm';
import { ActiveNotificationsList } from './ActiveNotificationsList';

export const NotificationManager = () => {
  const { notifications, addNotification, deleteNotification } = useData();
  
  return (
    <div className="space-y-6">
      <NotificationForm addNotification={addNotification} />
      <ActiveNotificationsList 
        notifications={notifications} 
        deleteNotification={deleteNotification} 
      />
    </div>
  );
};
