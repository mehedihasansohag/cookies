
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Cookie, Plan } from '@/types/dataTypes';

interface CookieFormProps {
  isEditing: boolean;
  currentCookie: Cookie | null;
  selectedPlanId: string;
  plans: Plan[];
  onSave: (cookieData: Partial<Cookie>) => void;
  onCancel: () => void;
}

const CookieForm = ({ 
  isEditing, 
  currentCookie, 
  selectedPlanId, 
  plans, 
  onSave, 
  onCancel 
}: CookieFormProps) => {
  const [platform, setPlatform] = useState('');
  const [cookieData, setCookieData] = useState('');
  const [domain, setDomain] = useState('');
  const [planId, setPlanId] = useState(selectedPlanId);
  
  // Initialize form when editing mode or current cookie changes
  useEffect(() => {
    if (isEditing && currentCookie) {
      setPlatform(currentCookie.platform || '');
      setCookieData(currentCookie.cookieData || '');
      setDomain(currentCookie.domain || '');
      setPlanId(currentCookie.planId);
    } else {
      // Reset form when not editing
      if (!isEditing) {
        setPlatform('');
        setCookieData('');
        setDomain('');
        setPlanId(selectedPlanId);
      }
    }
  }, [isEditing, currentCookie, selectedPlanId]);

  // Update domain when platform changes (only when not editing)
  useEffect(() => {
    if (!isEditing && platform) {
      // Generate a domain suggestion based on the platform
      const domainMap: Record<string, string> = {
        'udemy': 'udemy.com',
        'coursera': 'coursera.org',
        'skillshare': 'skillshare.com',
        'masterclass': 'masterclass.com',
        'canva': 'canva.com',
        'canva pro': 'canva.com',
        'grammarly': 'grammarly.com',
        'chatgpt': 'chat.openai.com',
        'quillbot': 'quillbot.com',
        'codecademy': 'codecademy.com',
      };

      const cleanPlatform = platform.toLowerCase().trim();
      const suggestedDomain = domainMap[cleanPlatform] || `${cleanPlatform.replace(/\s+/g, '')}.com`;
      setDomain(suggestedDomain);
    }
  }, [platform, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform.trim()) {
      toast.error("Platform name is required");
      return;
    }
    
    if (!cookieData.trim()) {
      toast.error("Cookie data is required");
      return;
    }

    if (!domain.trim()) {
      toast.error("Domain URL is required");
      return;
    }
    
    if (!planId) {
      toast.error("Please select a plan");
      return;
    }
    
    onSave({
      platform,
      cookieData,
      domain,
      planId
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Cookie' : 'Add New Cookie'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update cookie information' : 'Create a new cookie for a plan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              Platform Name
            </label>
            <Input
              id="platform"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              placeholder="e.g., Udemy, Coursera"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain URL
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g., coursera.org"
            />
            <p className="text-xs text-gray-500">
              Domain where cookies will be set (without http:// or www)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="plan" className="text-sm font-medium">
              Select Plan
            </label>
            <Select 
              // value={planId} 
              onValueChange={setPlanId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan._id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cookieData" className="text-sm font-medium">
              Cookie Data
            </label>
            <Textarea
              id="cookieData"
              value={cookieData}
              onChange={e => setCookieData(e.target.value)}
              placeholder="Paste cookie data here (JSON format)"
              className="h-32"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Cookie' : 'Add Cookie'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CookieForm;
