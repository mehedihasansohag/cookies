import React, { useState } from 'react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Notification, NotificationPriority } from '@/types/notification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Bell, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

export const Notifications = () => {
  const { notifications } = useData(); // Removed markNotificationAsRead
  const { user: currentUser } = useAuth();
  
  const [expandedNotifications, setExpandedNotifications] = useState<Record<string, boolean>>({});

  // Store read notification IDs in localStorage, specific to the current user
  const [readNotificationIds, setReadNotificationIds] = useLocalStorage<string[]>(
    currentUser ? `userReadNotifications_${currentUser.id}` : 'userReadNotifications_guest', // Fallback key, though user should exist
    []
  );

  const toggleNotificationExpand = (id: string) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const activeNotifications = notifications
    ?.filter(notification => {
      if (!notification.expiresAt) return true;
      return new Date(notification.expiresAt) > new Date();
    })
    .sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder: Record<NotificationPriority, number> = {
        'high': 3,
        'medium': 2,
        'low': 1
      };
      
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) || [];
  
  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Bell className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getAlertVariant = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return { className: 'border-destructive' };
      case 'medium':
        return { className: 'border-amber-500' };
      case 'low':
        return { className: 'border-blue-500' };
      default:
        return {};
    }
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isNotificationRead = (notificationId: string) => {
    return readNotificationIds.includes(notificationId);
  };

  const handleMarkAsRead = (notificationId: string) => {
    if (!isNotificationRead(notificationId)) {
      setReadNotificationIds([...readNotificationIds, notificationId]);
    }
  };

  if (!currentUser) {
    // Should not happen in a protected route context, but good for safety
    return null;
  }
  
  if (activeNotifications.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Important updates and announcements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeNotifications.map(notification => (
            <Alert 
              key={notification.id} 
              {...getAlertVariant(notification.priority)}
              className={`${isNotificationRead(notification.id) ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start">
                <div className="mr-3">
                  {getPriorityIcon(notification.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <AlertTitle className="font-bold mb-1">
                      {notification.title}
                    </AlertTitle>
                    {notification.priority === 'high' && (
                      <Badge variant="destructive">Important</Badge>
                    )}
                  </div>
                  
                  {notification.message.length > 120 ? (
                    <div className="mt-1">
                      <Accordion type="single" collapsible className="border-none p-0">
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger 
                            className="p-0 hover:no-underline" 
                            onClick={() => toggleNotificationExpand(notification.id)}
                          >
                            <AlertDescription className="text-sm text-left"> {/* Ensure text is left-aligned */}
                              {expandedNotifications[notification.id] 
                                ? notification.message 
                                : truncateText(notification.message)}
                            </AlertDescription>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-0">
                            <AlertDescription className="text-sm">
                              {notification.message}
                            </AlertDescription>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ) : (
                    <AlertDescription className="text-sm mt-1">
                      {notification.message}
                    </AlertDescription>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {!isNotificationRead(notification.id) && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
