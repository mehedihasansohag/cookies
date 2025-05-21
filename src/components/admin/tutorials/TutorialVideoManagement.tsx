
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTutorialForm } from '@/hooks/useTutorialForm';
import { TutorialVideoForm } from './TutorialVideoForm';
import { TutorialVideoPreview } from './TutorialVideoPreview';

interface TutorialVideoManagementProps {
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
}

const TutorialVideoManagement: React.FC<TutorialVideoManagementProps> = ({ type }) => {
  const {
    title,
    description,
    videoFile,
    previewUrl,
    thumbnailFile,
    thumbnailUrl,
    existingVideo,
    isGeneratingThumbnail,
    handleTitleChange,
    handleDescriptionChange,
    handleFileChange,
    handleThumbnailChange,
    regenerateThumbnail,
    handleSubmit,
    removeVideo,
    removeThumbnail,
    resetForm
  } = useTutorialForm(type);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="form">Edit Video</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TutorialVideoForm
                title={title}
                description={description}
                videoFile={videoFile}
                thumbnailFile={thumbnailFile}
                existingVideo={existingVideo}
                type={type}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onVideoChange={handleFileChange}
                onThumbnailChange={handleThumbnailChange}
                onRegenerateThumbnail={regenerateThumbnail}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <Button type="submit" className="flex-1">
                  {existingVideo ? 'Save Changes' : 'Create Tutorial'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 sm:flex-none">
                  Reset Form
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview">
            <TutorialVideoPreview
              title={title}
              description={description}
              previewUrl={previewUrl}
              thumbnailUrl={thumbnailUrl}
              isGeneratingThumbnail={isGeneratingThumbnail}
              onRemoveVideo={removeVideo}
              onRemoveThumbnail={removeThumbnail}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TutorialVideoManagement;
