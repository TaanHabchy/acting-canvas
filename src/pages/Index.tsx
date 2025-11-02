import Navigation from "@/components/Navigation";
import VideoSection from "@/components/VideoSection";
import { useMedia } from "@/hooks/useMedia";

const Index = () => {
  const { data: videos, isLoading, error } = useMedia('video');
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll overflow-hidden">
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
        {videos && videos.length === 0 && (
          <div className="h-screen flex items-center justify-center">
            <p className="text-foreground/70">No videos found</p>
          </div>
        )}
        {videos && videos.map((video) => (
          <VideoSection key={video.id} videoUrl={video.storage_path} />
        ))}
      </div>
    </div>
  );
};

export default Index;
