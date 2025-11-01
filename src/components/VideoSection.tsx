interface VideoSectionProps {
  videoUrl: string;
}

const VideoSection = ({ videoUrl }: VideoSectionProps) => {
  return (
    <section className="h-screen w-full snap-start snap-always flex items-center justify-center bg-background relative overflow-hidden p-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-10" />
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
        autoPlay={true}
      />
    </section>
  );
};

export default VideoSection;
