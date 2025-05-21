
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Platform, Plan, DurationType } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';
import { BasicPlanDetails } from './BasicPlanDetails';
import { DurationInputs } from './DurationInputs';
import { StickerSettings } from './StickerSettings';
import { PlatformSelector } from './PlatformSelector';

interface CreatePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (plan: Omit<Plan, 'id'>) => void;
  platforms: Platform[];
  homepagePlansCount: number;
  nextHomepageOrder: number;
}

const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  platforms,
  homepagePlansCount,
  nextHomepageOrder
}) => {
  const [newPlan, setNewPlan] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    price: 0,
    platforms: [],
    durationType: 'months',
    durationValue: 1,
    stickerText: '',
    stickerColor: '#8B5CF6',
    showOnHomepage: false
  });

  const togglePlatform = (platformId: string) => {
    if (newPlan.platforms.includes(platformId)) {
      setNewPlan({
        ...newPlan,
        platforms: newPlan.platforms.filter(id => id !== platformId)
      });
    } else {
      setNewPlan({
        ...newPlan,
        platforms: [...newPlan.platforms, platformId]
      });
    }
  };

  const handleCreatePlan = () => {
    try {
      if (!newPlan.name) {
        toast({ title: "Error", description: "Plan name is required" });
        return;
      }
      
      if (newPlan.price <= 0) {
        toast({ title: "Error", description: "Price must be greater than 0" });
        return;
      }
      
      if (newPlan.platforms.length === 0) {
        toast({ title: "Error", description: "Select at least one platform" });
        return;
      }
      
      if (newPlan.durationValue <= 0) {
        toast({ title: "Error", description: "Duration value must be greater than 0" });
        return;
      }
      
      // Check if we're trying to add another homepage plan when we already have 3
      if (newPlan.showOnHomepage && homepagePlansCount >= 3) {
        toast({ 
          title: "Error", 
          description: "You can only select up to 3 plans for the homepage. Please deselect another plan first."
        });
        return;
      }
      
      // If plan is for homepage, set the order
      if (newPlan.showOnHomepage) {
        newPlan.homepageOrder = nextHomepageOrder;
      }

      onSubmit(newPlan);
      
      // Reset form
      setNewPlan({
        name: '',
        description: '',
        price: 0,
        platforms: [],
        durationType: 'months',
        durationValue: 1,
        stickerText: '',
        stickerColor: '#8B5CF6',
        showOnHomepage: false
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create plan" });
      console.error(error);
    }
  };

  const handleHomepageChange = (checked: boolean) => {
    if (checked && homepagePlansCount >= 3) {
      toast({ 
        title: "Error", 
        description: "You can only select up to 3 plans for the homepage"
      });
      return;
    }
    setNewPlan({ ...newPlan, showOnHomepage: checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
          <DialogDescription>
            Add a new subscription plan to your platform
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <BasicPlanDetails
              name={newPlan.name}
              setName={(name) => setNewPlan({ ...newPlan, name })}
              description={newPlan.description}
              setDescription={(description) => setNewPlan({ ...newPlan, description })}
              price={newPlan.price}
              setPrice={(price) => setNewPlan({ ...newPlan, price })}
              showOnHomepage={newPlan.showOnHomepage}
              setShowOnHomepage={handleHomepageChange}
              homepagePlansCount={homepagePlansCount}
            />
            
            <DurationInputs
              durationType={newPlan.durationType}
              setDurationType={(durationType) => setNewPlan({ ...newPlan, durationType })}
              durationValue={newPlan.durationValue}
              setDurationValue={(durationValue) => setNewPlan({ ...newPlan, durationValue })}
            />
            
            <StickerSettings
              stickerText={newPlan.stickerText}
              setStickerText={(stickerText) => setNewPlan({ ...newPlan, stickerText })}
              stickerColor={newPlan.stickerColor}
              setStickerColor={(stickerColor) => setNewPlan({ ...newPlan, stickerColor })}
            />
            
            <PlatformSelector
              platforms={platforms}
              selectedPlatforms={newPlan.platforms}
              togglePlatform={togglePlatform}
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePlan}>
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanDialog;
