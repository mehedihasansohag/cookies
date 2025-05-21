
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TutorialVideoProps } from '@/types/access';
import { TutorialVideo as TutorialVideoType } from '@/types/access';
import { Play, Smartphone, Tablet } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import tutorialApi from '@/services/api/tutorialApi';

export const TutorialVideo = ({ title, description, contentLabel, videoUrl, thumbnailUrl: defaultThumbnail }: TutorialVideoProps) => {
  const [isDesktopPlaying, setIsDesktopPlaying] = useState(false);
  const [isMobilePlaying, setIsMobilePlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [tutorials, setTutorials] = useState<TutorialVideoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const data = await tutorialApi.getAll();
        setTutorials(data);
      } catch (error) {
        console.error('Failed to fetch tutorials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTutorials();
  }, []);
  
  const videoType = contentLabel.toLowerCase().includes('login') ? 'login' : 'cookie';
  const desktopVideo = tutorials.find(video => video.type === videoType);
  const mobileVideo = tutorials.find(video => video.type === `${videoType}-mobile`);
  
  // Use stored video data based on active device
  const activeVideo = activeDevice === 'desktop' ? desktopVideo : mobileVideo;
  
  // Set display data based on active video or props
  const displayTitle = activeVideo?.title || title;
  const displayDescription = activeVideo?.description || description;
  const displayUrl = activeVideo?.contentUrl || videoUrl;
  const displayThumbnail = activeVideo?.thumbnailUrl || defaultThumbnail;

  const handlePlayDesktopVideo = () => {
    setIsDesktopPlaying(true);
  };
  
  const handlePlayMobileVideo = () => {
    setIsMobilePlaying(true);
  };

  const handleDeviceChange = (device: 'desktop' | 'mobile') => {
    setActiveDevice(device);
    // Don't reset playing state when switching tabs to preserve video state
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Loading tutorial videos...</CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <div className="animate-pulse">Loading content...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{displayTitle}</CardTitle>
        <CardDescription>{displayDescription}</CardDescription>
        
        <Tabs 
          value={activeDevice} 
          onValueChange={(value) => handleDeviceChange(value as 'desktop' | 'mobile')} 
          className="mt-4"
        >
          <TabsList className={cn(
            "w-full max-w-[400px] mx-auto grid",
            isMobile ? "grid-cols-1 gap-2" : "grid-cols-2"
          )}>
            <TabsTrigger 
              value="desktop" 
              className="flex items-center gap-1 text-xs px-2 sm:text-sm sm:px-3"
            >
              <Tablet className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">How To Access Desktop</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mobile" 
              className="flex items-center gap-1 text-xs px-2 sm:text-sm sm:px-3"
            >
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">How to access Mobile device</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="desktop" forceMount={true} hidden={activeDevice !== 'desktop'}>
          {desktopVideo && desktopVideo.contentUrl ? (
            <div className="aspect-video w-full max-w-full bg-gray-100 rounded-md overflow-hidden relative">
              {!isDesktopPlaying && desktopVideo.thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={desktopVideo.thumbnailUrl} 
                    alt={desktopVideo.title} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={handlePlayDesktopVideo}
                  >
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  key="desktop-video"
                  src={desktopVideo.contentUrl}
                  controls
                  autoPlay={isDesktopPlaying}
                  className="w-full h-full"
                  poster={desktopVideo.thumbnailUrl || "/placeholder.svg"}
                  onEnded={() => setIsDesktopPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Desktop Tutorial Video Not Available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mobile" forceMount={true} hidden={activeDevice !== 'mobile'}>
          {mobileVideo && mobileVideo.contentUrl ? (
            <div className="max-w-[375px] mx-auto">
              <div className="relative">
                <Smartphone className="text-gray-300 absolute -top-6 -left-4 -z-10 h-12 w-12" />
                <div className="aspect-[9/16] bg-gray-100 rounded-md overflow-hidden relative border-4 border-gray-300">
                  {!isMobilePlaying && mobileVideo.thumbnailUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={mobileVideo.thumbnailUrl} 
                        alt={mobileVideo.title} 
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={handlePlayMobileVideo}
                      >
                        <div className="bg-black bg-opacity-50 rounded-full p-4">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <video
                      key="mobile-video"
                      src={mobileVideo.contentUrl}
                      controls
                      autoPlay={isMobilePlaying}
                      className="w-full h-full"
                      poster={mobileVideo.thumbnailUrl || "/placeholder.svg"}
                      onEnded={() => setIsMobilePlaying(false)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[300px] mx-auto aspect-[9/16] bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Mobile Tutorial Not Available</p>
              </div>
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};
