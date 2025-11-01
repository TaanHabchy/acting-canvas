interface VideoSectionProps {
  videoUrl: string;
  title: string;
}

const VideoSection = ({ videoUrl, title }: VideoSectionProps) => {
  return (
    <section className="h-screen w-full snap-start snap-always flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-10" />
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
      />
      <div className="absolute bottom-8 left-8 z-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg">
          {title}
        </h2>
      </div>
    </section>
  );
};

export default VideoSection;
