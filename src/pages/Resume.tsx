import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Resume = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-bold mb-12 text-foreground">Resume</h1>

        <div className="space-y-12 max-w-4xl">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Lead Role - Feature Film</h3>
                <p className="text-muted-foreground mb-2">Independent Production | 2023</p>
                <p className="text-foreground/80">
                  Portrayed a complex character in an award-winning indie drama that premiered at major film festivals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Supporting Role - TV Series</h3>
                <p className="text-muted-foreground mb-2">Streaming Platform | 2022</p>
                <p className="text-foreground/80">
                  Recurring character across 8 episodes in a critically acclaimed drama series.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Theater Production</h3>
                <p className="text-muted-foreground mb-2">Regional Theater | 2021</p>
                <p className="text-foreground/80">
                  Performed in a modern adaptation of a classic play to sold-out audiences.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Training</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Acting Conservatory</h3>
                <p className="text-muted-foreground">BFA in Theater Performance | 2020</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">On-Camera Intensive</h3>
                <p className="text-muted-foreground">Advanced Film Acting Workshop | 2021</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Voice & Movement</h3>
                <p className="text-muted-foreground">Specialized Training | Ongoing</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-foreground/80">• Stage Combat</div>
              <div className="text-foreground/80">• Improvisation</div>
              <div className="text-foreground/80">• Voice Acting</div>
              <div className="text-foreground/80">• Dance</div>
              <div className="text-foreground/80">• Dialect Coaching</div>
              <div className="text-foreground/80">• Stunts</div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Resume;
