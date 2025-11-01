import Navigation from "@/components/Navigation";
import VideoSection from "@/components/VideoSection";
import { useMedia } from "@/hooks/useMedia";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: videos, isLoading, error } = useMedia('video');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading videos</p>
          <p className="text-sm text-muted-foreground">Please run the SQL setup in your Supabase dashboard</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center max-w-md px-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">No Videos Yet</h2>
            <p className="text-muted-foreground">
              Run the SQL setup in your Supabase dashboard, then upload your videos to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {videos.map((video) => (
          <VideoSection key={video.id} videoUrl={video.url} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default Index;
