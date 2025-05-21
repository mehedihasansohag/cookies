
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, DurationType } from '@/types/dataTypes';
import { DurationInputs } from './DurationInputs';
import { PlatformSelector } from './PlatformSelector';
import { StickerSettings } from './StickerSettings';
import { PlanBasicInfo, PlanFormActions } from './PlanFormComponents';

// Define allowed duration types for this form specifically
type AllowedDurationType = 'days' | 'months' | 'years';

interface PlanFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: number;
  setPrice: (price: number) => void;
  selectedPlatforms: string[];
  togglePlatform: (platformId: string) => void;
  platforms: Platform[];
  stickerText: string;
  setStickerText: (text: string) => void;
  stickerColor: string;
  setStickerColor: (color: string) => void;
  durationType: DurationType;
  handleDurationTypeChange: (value: DurationType) => void;
  durationValue: number;
  setDurationValue: (value: number) => void;
  handleSave: () => void;
  isSaving: boolean;
  isNewPlan?: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  selectedPlatforms,
  togglePlatform,
  platforms,
  stickerText,
  setStickerText,
  stickerColor,
  setStickerColor,
  durationType,
  handleDurationTypeChange,
  durationValue,
  setDurationValue,
  handleSave,
  isSaving,
  isNewPlan
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Information */}
        <PlanBasicInfo
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
        />
        
        {/* Duration Fields */}
        <DurationInputs
          durationType={durationType}
          setDurationType={handleDurationTypeChange}
          durationValue={durationValue}
          setDurationValue={setDurationValue}
        />
        
        {/* Sticker Settings */}
        <StickerSettings
          stickerText={stickerText}
          setStickerText={setStickerText}
          stickerColor={stickerColor}
          setStickerColor={setStickerColor}
        />
        
        {/* Platform Selection */}
        <PlatformSelector
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
        />
        
        {/* Form Actions */}
        <PlanFormActions
          handleSave={handleSave}
          isSaving={isSaving}
          isNewPlan={isNewPlan}
        />
      </CardContent>
    </Card>
  );
};

export default PlanForm;
