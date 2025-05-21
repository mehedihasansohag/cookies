
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const Plans = () => {
  const { plans, platforms } = useData();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Find platforms included in each plan
  const getPlatformNames = (platformIds: string[]) => {
    return platformIds
      .map(id => platforms.find(p => p.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const togglePlatformFilter = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  // Format duration for display
  const formatDuration = (plan: any): string => {
    if (!plan.durationType || !plan.durationValue) {
      return "per month"; // Default fallback
    }

    if (plan.durationValue === 1) {
      // Singular form (e.g., "per day" instead of "per days")
      return `per ${plan.durationType.slice(0, -1)}`;
    }
    
    return `per ${plan.durationValue} ${plan.durationType}`;
  };

  // Filter plans based on selected platforms
  const filteredPlans = selectedPlatforms.length === 0
    ? plans
    : plans.filter(plan => 
        selectedPlatforms.some(platformId => plan.platforms.includes(platformId))
      );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
      <p className="text-gray-600 mb-8">Choose a plan that fits your learning goals</p>
      
      {/* Platform Filters */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Filter by Platform</h2>
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <Button
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
              size="sm"
              onClick={() => togglePlatformFilter(platform.id)}
            >
              {platform.name}
            </Button>
          ))}
          {selectedPlatforms.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedPlatforms([])}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No plans match your selection</h3>
          <p className="text-gray-600 mb-4">Try selecting different platforms or clearing your filters</p>
          <Button onClick={() => setSelectedPlatforms([])}>View All Plans</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => {
            const platformNames = getPlatformNames(plan.platforms);
            
            return (
              <Card key={plan.id} className="card-hover">
                {plan.stickerText && (
                  <div 
                    className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg" 
                    style={{ backgroundColor: plan.stickerColor || '#8B5CF6' }}
                  >
                    {plan.stickerText}
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-3xl font-bold">${plan.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(plan)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {platformNames.map((platform, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">{platform}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/plans/${plan.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Plans;
