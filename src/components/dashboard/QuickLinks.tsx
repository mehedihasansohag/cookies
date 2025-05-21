
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickLinksProps {
  isAdmin: boolean;
}

export const QuickLinks = ({ isAdmin }: QuickLinksProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/plans">Browse Plans</Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/support">Contact Support</Link>
        </Button>
        {isAdmin && (
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
