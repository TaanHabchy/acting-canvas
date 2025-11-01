import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-bold mb-12 text-foreground">About Me</h1>

        <div className="max-w-4xl">
          <Card className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Headshot</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-foreground/90 leading-relaxed">
                  I'm a passionate actor dedicated to bringing authentic, compelling characters to life on screen and stage. With a foundation in classical theater and modern film techniques, I approach each role with depth and commitment.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                  My journey in acting began at a young age, and I've since trained at prestigious institutions and worked with talented directors and fellow actors who have shaped my craft.
                </p>
                
                <p className="text-lg text-foreground/90 leading-relaxed">
                  I believe in the power of storytelling to connect people and create meaningful experiences. Whether it's drama, comedy, or something in between, I bring authenticity and energy to every project.
                </p>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Contact</h3>
                  <div className="space-y-2 text-foreground/80">
                    <p>Email: actor@portfolio.com</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Location: Los Angeles, CA</p>
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
