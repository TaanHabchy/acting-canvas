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
                    src={'/headshot.jpeg'}
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
                  from the University of Dallas. I fell in love with acting in highschool, where I performed in classical theatre.
                    In college I didn't have time for theatre until my final semester, performing in
                    <span className={'italic'}> The Glory in the Flower</span>.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                 I graduated this past May, and although I was extremely blessed to land a Software Engineering role with a team of great guys,
                 the notion that life was more than work was always in the back of my mind,
                    and ultimately I decided to drop the full-time salary.
                 Now <span className={'italic'}>obviously</span> I hope that a career in acting works out,
                    but I'm not <span className={'italic'}>that</span> hopelessly romantic... I know that the odds are against me.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                  Whether or not I can make a career out of acting, I trust that all will work out.
                    At the end of this journey, I just hope I can say that I truly came to know myself.
                </p>
               <ContactInfo />
              </div>
            </div>
          </Card>
        </div>

        {portfolioPhotos.length > 0 && (
            <div className="mt-16 px-2 sm:px-16">
                <div className="columns-2 md:columns-3 [column-fill:_balance] px-2 sm:px-6">
                    {portfolioPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            className="mb-6 break-inside-avoid overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={photo.storage_path}
                                alt="Portfolio photo"
                                className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-300 mx-auto block max-w-full sm:max-w-none"
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
