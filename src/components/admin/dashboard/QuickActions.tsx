
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, CreditCard, Cookie, Tag, User, Video, Bell, BookOpen, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const QuickActions = () => {
  const { isAdmin, isManager } = useAuth();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/plans/new">
              <Package className="h-5 w-5 mb-2" />
              <span>Create New Plan</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/plans">
              <BookOpen className="h-5 w-5 mb-2" />
              <span>Manage Plans</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/platforms">
              <Users className="h-5 w-5 mb-2" />
              <span>Manage Platforms</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/credentials">
              <CreditCard className="h-5 w-5 mb-2" />
              <span>Manage Credentials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/cookies">
              <Cookie className="h-5 w-5 mb-2" />
              <span>Manage Cookies</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/coupons">
              <Tag className="h-5 w-5 mb-2" />
              <span>Manage Coupons</span>
            </Link>
          </Button>
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/users">
                <User className="h-5 w-5 mb-2" />
                <span>Manage Users</span>
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/tutorials">
              <Video className="h-5 w-5 mb-2" />
              <span>Manage Tutorials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/mobile-tutorials">
              <Smartphone className="h-5 w-5 mb-2" />
              <span>Manage Mobile Tutorials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/notifications">
              <Bell className="h-5 w-5 mb-2" />
              <span>Notifications</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
