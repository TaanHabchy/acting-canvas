import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MediaManager from "@/components/dashboard/MediaManager";
import ExperienceManager from "@/components/dashboard/ExperienceManager";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Content Dashboard</h1>
        
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="media">Media (Videos & Photos)</TabsTrigger>
            <TabsTrigger value="experience">Experience & Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="media">
            <Card className="p-6">
              <MediaManager />
            </Card>
          </TabsContent>
          
          <TabsContent value="experience">
            <Card className="p-6">
              <ExperienceManager />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
