import { useEffect, useRef, useState } from "react";

interface VideoSectionProps {
  videoUrl: string;
}

const VideoSection = ({ videoUrl }: VideoSectionProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.6 } // Play when 60% visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isVisible) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isVisible]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
            if (next) {
                next.scrollIntoView({ behavior: "smooth" });
            }
        };

        video.addEventListener("ended", handleEnded);
        return () => video.removeEventListener("ended", handleEnded);
    }, []);

    return (
      <section
          ref={sectionRef}
          className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden">
          {/* Blurred background layer */}
          <video
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110"
              loop
              muted
              playsInline
          />

          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />

          <video
              ref={videoRef}
        src={videoUrl}
              className="
  w-full h-auto
  sm:w-2/3 sm:h-2/3
  object-cover rounded-3xl cursor-pointer z-10
  transition-all
"

              controls
        playsInline
        preload="metadata"
        autoPlay={true}
              muted={true}
      />
    </section>
  );
};

export default VideoSection;
