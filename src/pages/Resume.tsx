import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useExperience } from "@/hooks/useExperience";

const Resume = () => {
  const { data: experiences, isLoading: experiencesLoading } = useExperience(['short film', 'theatre', 'tv']);
  const { data: training, isLoading: trainingLoading } = useExperience(['training']);
  const { data: skills, isLoading: skillsLoading } = useExperience(['skill']);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-bold mb-12 text-foreground">Resume</h1>

        <div className="space-y-12 max-w-4xl">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Experience</h2>
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
                          <h2 className="text-xl font-bold capitalize mb-3 text-foreground">
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
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Training</h2>
            {trainingLoading ? (
              <p className="text-foreground/70">Loading...</p>
            ) : (
              <div className="space-y-4">
                {training?.map((item) => (
                  <div key={item.id}>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.director} • {item.studio}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Skills</h2>
            {skillsLoading ? (
              <p className="text-foreground/70">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills?.map((skill) => (
                  <div key={skill.id} className="text-foreground/80">• {skill.title}</div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Resume;
