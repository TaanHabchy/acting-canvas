import Navigation from "@/components/Navigation";
import VideoSection from "@/components/VideoSection";

const Index = () => {
  const videos = [
    {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Demo Reel 2024",
    },
    {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      title: "Short Film - Lead Role",
    },
    {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Commercial Work",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {videos.map((video, index) => (
          <VideoSection key={index} videoUrl={video.url} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default Index;
