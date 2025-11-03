import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useMedia } from "@/hooks/useMedia";
import { supabase } from "@/integrations/supabase/client";
import ContactInfo from "@/components/ContactInfo.tsx";

const About = () => {
  const { data: photos, isLoading } = useMedia('photo');
  const headshotPhoto = photos?.find(photo => photo.display_order === 0);
  const headshotUrl = headshotPhoto?.storage_path;
  const portfolioPhotos = (photos?.filter(photo => photo.display_order !== 0) || []).sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-screen">
          <Card className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <div className="w-64 h-64 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : headshotUrl ? (
                  <img 
                    src={headshotUrl} 
                    alt="Headshot" 
                    className="w-96 h-104 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No photo</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-foreground/90 leading-relaxed">
                  My name is Sharbel Habchy, I'm a Dallas based actor, with a B.A. in Computer Science
                  from the University of Dallas. I fell in love with acting back in highschool, where every student would have to
                  perform in classical theatre. In college, I didn't have the time for theatre though until my final semester, when I performed in The
                  Glory in the Flower.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                 I graduated this past May, and although I was extremely blessed to land a Software Engineering role with a team of truly amazing people.
                 The little voice inside my head, telling me that my search wasn't over, convinced me to step down from my full-time salary,
                  and instead try and pursue acting full time. I'm hoping to not only grow as an actor, but also gain experience working behind the camera
                  and see what that's like.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                  Aside from acting, I am a practicing Maronite Catholic, so I try the best that I can to always put God first.
                  I love reading novels, Anna Karenina being my favorite, and I've recently started playing pickleball with my roomates.
                </p>

               <ContactInfo />
              </div>
            </div>
          </Card>
        </div>

        {portfolioPhotos.length > 0 && (
            <div className="mt-16 px-16">
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {portfolioPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        className="mb-6 break-inside-avoid overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                          src={photo.storage_path}
                          alt="Portfolio photo"
                          className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-300"
                          loading="lazy"
                      />
                    </div>
                ))}
              </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default About;
