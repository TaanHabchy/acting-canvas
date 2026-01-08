import Navigation from "@/components/Navigation";
import { useMedia } from "@/hooks/useMedia";
import ContactInfo from "@/components/ContactInfo.tsx";
import { useState } from "react";

const About = () => {
    const { data: photos, isLoading } = useMedia("photo");
    const portfolioPhotos = (photos || []).sort(() => Math.random() - 0.5);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-6 pb-16 pt-32">
                {/* Global loader */}
                {isLoading && (
                    <div className="flex justify-center mt-32">
                        <div className="animate-pulse text-muted-foreground text-sm">
                            Loading photos…
                        </div>
                    </div>
                )}

                {!isLoading && portfolioPhotos.length > 0 && (
                    <div className="px-2 sm:px-16">
                        <div className="columns-1 md:columns-3 px-0 sm:px-6">
                            {portfolioPhotos.map((photo) => (
                                <ImageFadeIn key={photo.id} url={photo.storage_path} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Fade-in Image Component ---
const ImageFadeIn = ({ url }: { url: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className="md:mb-6 break-inside-avoid overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
        >
            <img
                src={url}
                alt="Portfolio photo"
                onLoad={() => setLoaded(true)}
                className={`w-full h-auto object-cover transition-transform duration-300 block max-w-full sm:max-w-none 
          ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
        `}
                loading="lazy"
            />
        </div>
    );
};

export default About;
