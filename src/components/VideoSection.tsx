import { useEffect, useRef, useState } from "react";

interface VideoSectionProps {
  videoUrl: string;
}

const VideoSection = ({ videoUrl }: VideoSectionProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full snap-start overflow-hidden flex items-center justify-center md:pt-8"
        >
            {/* blurred background video */}
    {/*        <iframe*/}
    {/*            src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1`}*/}
    {/*            className="*/}
    {/*  absolute inset-0*/}
    {/*  w-full h-full*/}
    {/*  object-cover*/}
    {/*  scale-125*/}
    {/*  blur-3xl*/}
    {/*  pointer-events-none*/}
    {/*"*/}
    {/*        />*/}

            {/* foreground video (interactive) */}
            <iframe
                src={`https://www.youtube.com/embed/${videoUrl}?loop=1&rel=0&modestbranding=1&playsinline=1&playlist=${videoUrl}`}
                className="
    relative z-10
    w-full
    sm:w-2/3
    aspect-video
    md:rounded
    shadow-xl
  "
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
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
