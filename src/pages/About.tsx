import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useMedia } from "@/hooks/useMedia";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const { data: photos, isLoading } = useMedia('photo');
  const headshotPhoto = photos?.find(photo => photo.display_order === 0);
  const headshotUrl = headshotPhoto?.storage_path;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-bold mb-12 text-foreground">Who am I?</h1>

        <div className="max-w-4xl">
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
                  Whats up! I'm a Dallas based actor, with a B.A. in Computer Science
                  from the University of Dallas. I fell in love with acting back in highschool, where every student would have to
                  perform in classical theatre. Although I never took it too seriously, I loved the process, and would always
                  audition for the lead role.  Once in college, I didn't have the time for theatre though until my final semester, when I performed in The
                  Glory in the Flower.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                 I graduated this past May, and although I was extremely blessed to land a Software Engineering role with a team of truly amazing people.
                 The little voice inside my head, telling me that my search wasn't over, kept getting louder. And eventually it got loud enough, where I
                  decided to step down from my full-time salary, and instead try and pursue acting full time.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                  Aside from acting, I am a practicing Maronite Catholic, and I know that at the end of the day, God's will shall be done.
                  Honestly, what gets me most excited about entering the film world, is getting to encounter all the extremely creative and passionate
                  people out there.
                </p>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Contact</h3>
                  <div className="space-y-2 text-foreground/80">
                    <p>Email: sharbelhabchy@gmail.com</p>
                    <p>Phone: (978) 407-9564</p>
                    <p>Location: Dallas, TX</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
