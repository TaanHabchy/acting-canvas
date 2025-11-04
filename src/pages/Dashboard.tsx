import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MediaManager from "@/components/dashboard/MediaManager";
import ExperienceManager from "@/components/dashboard/ExperienceManager";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import {ThemeToggle} from "@/components/ui/toggle_theme.tsx";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className={"flex flex-row justify-between items-center"}><h1
            className="text-4xl font-bold mb-8 text-foreground">Content Dashboard</h1>
          <ThemeToggle/></div>
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="media">Media (Videos & Photos)</TabsTrigger>
            <TabsTrigger value="experience">Experience & Training</TabsTrigger>
            <TabsTrigger value="progress">People Tracker</TabsTrigger>
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
          
          <TabsContent value="progress">
            <Card className="p-6">
              <ProgressTracker />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
