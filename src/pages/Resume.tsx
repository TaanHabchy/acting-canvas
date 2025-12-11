import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExperience } from "@/hooks/useExperience";
import ContactInfo from "@/components/ContactInfo.tsx";

const Resume = () => {
  const { data: experiences, isLoading: experiencesLoading } = useExperience(['short film', 'theatre', 'tv']);
  const { data: training, isLoading: trainingLoading } = useExperience(['training']);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 px-6 md:px-56 pt-24 pb-16">
        <div className="flex flex-col items-center justify-center space-y-12">
          <Card className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Experience</h2>
            {experiencesLoading ? (
              <p className="text-foreground/70">Loading...</p>
            ) : (
              <div className="space-y-6">
                {experiences &&
                    Object.entries(
                        experiences.reduce((acc, exp) => {
                          if (!acc[exp.type]) acc[exp.type] = [];
                          acc[exp.type].push(exp);
                          return acc;
                        }, {} as Record<string, typeof experiences>)
                    ).map(([type, exps]) => (
                        <section key={type} className="mb-6">
                          <h2 className="text-xl font-bold capitalize mb-3 text-primary">
                            {type}
                          </h2>
                          {exps.map((exp) => (
                              <div key={exp.id} className="mb-3">
                                <h3 className="text-l font-semibold text-foreground">
                                  {exp.title}
                                </h3>
                                <p className="text-muted-foreground mb-2">
                                  {exp.director || exp.studio
                                      ? `${exp.director || exp.studio} • ${exp.role ?? ''}`
                                      : exp.role}
                                </p>
                              </div>
                          ))}
                        </section>
                    ))}

              </div>
            )}
          </Card >

          <Card className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Training</h2>
            {trainingLoading ? (
              <p className="text-foreground/70">Loading...</p>
            ) : (
              <div className="space-y-4">
                {training?.map((item) => (
                  <div key={item.id}>
                    <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="text-muted-foreground">{item.director} • {item.studio}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Crew Experience</h2>
              <div className="flex flex-wrap gap-2">
                <div>
                  <h3 className="text-xl text-foreground"><strong className={'text-primary'}>Copa90</strong> • Production Assistant</h3>
                  <p className="text-muted-foreground">Drove gear between locations to setup the equipment for every shoot</p>
                  <p className="text-muted-foreground">Acted as a stand-in to properly align cameras and lighting, then as security to prevent people from interrupting interviews</p>

                  <h3 className="text-xl text-foreground pt-4"><strong className={'text-primary'}>Gifted Dreamers Productions</strong> • Production Assistant</h3>
                  <p className="text-muted-foreground">Slated every run, operated the boom when necessary, and helped setup lights for most scenes</p>
                  <p className="text-muted-foreground">Contacted local shops to request permission to shoot, then worked as crowd control so our recordings went uninterrupted</p>
                </div>
              </div>
          </Card>

          <Card className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Relevant Work Experience</h2>
              <div className="flex flex-wrap gap-2">
                <div>
                  <h3 className="text-xl text-foreground"><strong className={'text-primary'}>Verso Jobs</strong> • Chief Technology Officer</h3>
                  <p className="text-muted-foreground">Built the iOS/browser app Wayfinder, as well as an affiliate program</p>
                  <p className="text-muted-foreground">Created an AI grading system to speed up the hiring process </p>

                  <h3 className="text-xl text-foreground pt-4"><strong className={'text-primary'}>Autopilot</strong> • Full Stack Engineer</h3>
                  <p className="text-muted-foreground">Developing jest TS tests, to improve the security and reliability of Autopilot’s backend</p>
                  <p className="text-muted-foreground">Created and designed a customer support portal so that our reps could see and fix any customer’s issues</p>

                  <h3 className="text-xl text-foreground pt-4"><strong className={'text-primary'}>St. Rita's Catholic School</strong> • After School Caretaker</h3>
                  <p className="text-muted-foreground">Mentored and watched over children between 1st grade - 7th</p>
                  <p className="text-muted-foreground">Gained experience in being an all-time QB, negotiating and distribution of time on the merry-go-round, and sharing of snacks</p>
                </div>
              </div>
          </Card>
          <Card className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Info</h2>
            <ContactInfo/>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Resume;
