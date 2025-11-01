import Navigation from "@/components/Navigation";
import VideoSection from "@/components/VideoSection";

const Index = () => {
  // Add your local video files to the public folder and list them here
  const videos = [
    {
      id: "1",
      url: "/videos/demo-reel.mp4",
      title: "Demo Reel 2024",
    },
    {
      id: "2",
      url: "/videos/short-film.mp4",
      title: "Short Film - Lead Role",
    },
    {
      id: "3",
      url: "/videos/commercial.mp4",
      title: "Commercial Work",
    },
  ];

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
