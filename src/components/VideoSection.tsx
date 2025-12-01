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
            className="relative h-screen w-full snap-start overflow-hidden flex items-center justify-center"
        >
            {/* blurred background video */}
            <video
                src={videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className="
      absolute inset-0
      w-full h-full
      object-cover
      scale-125
      blur-3xl
      pointer-events-none
    "
            />

            {/* foreground video (interactive) */}
            <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                className="
      relative z-10
      w-full
      sm:w-2/3
      md:rounded-3xl
      shadow-xl
    "
            />

            {videoUrl.endsWith("greek-3.mp4") && (
                <p className="absolute bottom-6 z-20 text-white/70 text-xs tracking-wide opacity-0 animate-fade-in">
                    Scroll down for more
                </p>
            )}
        </section>



    );
};

export default VideoSection;
