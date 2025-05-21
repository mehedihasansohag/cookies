
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotificationPriority, Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationFormProps {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({ addNotification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('medium');
  const [expiresIn, setExpiresIn] = useState('7'); // Days

  const handleCreateNotification = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Validation Error", { description: "Please fill in all required fields" });
      return;
    }
    
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn || '7'));
    
    addNotification({
      title,
      message,
      priority,
      expiresAt: expiresAt.toISOString()
    });
    
    toast.success("Notification Created", { description: "Your notification has been sent to all users" });
    
    // Reset form
    setTitle('');
    setMessage('');
    setPriority('medium');
    setExpiresIn('7');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Notification</CardTitle>
        <CardDescription>Send a notification to all users' dashboards</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <Textarea
              id="message"
              placeholder="Enter your notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(value) => setPriority(value as NotificationPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expires" className="text-sm font-medium">Expires in (days)</label>
              <Input
                id="expires"
                type="number"
                placeholder="Days until expiration"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                min="1"
              />
            </div>
          </div>
          
          <Button 
            type="button" 
            onClick={handleCreateNotification} 
            className="w-full"
          >
            Create Notification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
