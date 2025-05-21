
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan } from '@/types/dataTypes';
import { Home } from 'lucide-react';

interface AdminPlanCardProps {
  plan: Plan;
  platformNames: string[];
  formatDuration: (durationType: string, durationValue: number) => string;
  toggleHomepageDisplay: (plan: Plan) => void;
  onEdit: (planId: string) => void;
  onDelete: (plan: Plan) => void;
}

const AdminPlanCard: React.FC<AdminPlanCardProps> = ({
  plan,
  platformNames,
  formatDuration,
  toggleHomepageDisplay,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="relative">
      {plan.stickerText && (
        <div 
          className="absolute top-0 right-0 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg"
          style={{ backgroundColor: plan.stickerColor || '#8B5CF6' }}
        >
          {plan.stickerText}
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{plan.name}</span>
          <span className="text-lg">${plan.price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        {/* Homepage Badge */}
        {plan.showOnHomepage && (
          <div className="mb-4">
            <Badge className="bg-blue-500">
              <Home className="w-3 h-3 mr-1" /> Homepage
            </Badge>
          </div>
        )}
        
        {/* Display duration */}
        <div className="mb-4">
          <Badge variant="outline" className="bg-blue-50">
            {formatDuration(plan.durationType || 'months', plan.durationValue || 1)}
          </Badge>
        </div>
        
        {platformNames.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Included Platforms:</p>
            <div className="flex flex-wrap gap-2">
              {platformNames.map((name, i) => (
                <Badge key={i} variant="outline">{name}</Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant={plan.showOnHomepage ? "default" : "outline"} 
            size="sm"
            className="flex-1"
            onClick={() => toggleHomepageDisplay(plan)}
          >
            <Home className="w-4 h-4 mr-2" />
            {plan.showOnHomepage ? "On Homepage" : "Add to Homepage"}
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(plan.id)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onDelete(plan)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPlanCard;
