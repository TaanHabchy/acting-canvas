import Navigation from "@/components/Navigation";
import VideoSection from "@/components/VideoSection";
import { useMedia } from "@/hooks/useMedia";

const Index = () => {
  const { data: videos, isLoading, error } = useMedia('video');
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        {isLoading && (
          <div className="h-screen flex items-center justify-center">
            <p className="text-foreground/70">Loading videos...</p>
          </div>
        )}
        {error && (
          <div className="h-screen flex items-center justify-center">
            <p className="text-destructive">Error loading videos: {error.message}</p>
          </div>
        )}
          <VideoSection key={0} videoUrl={"/demo_reel.mp4"} />
      </div>
    </div>
  );
};

export default Index;
