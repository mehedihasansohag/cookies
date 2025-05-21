
import React from 'react';
import { NotificationManager } from '@/components/admin/notifications/NotificationManager';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminNotifications = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Notification Management</h1>
      <p className="text-gray-600 mb-8">Create and manage user notifications</p>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <NotificationManager />
    </div>
  );
};

export default AdminNotifications;
