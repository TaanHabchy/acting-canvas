import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableStats {
  name: string;
  total: number;
  visible: number;
  hidden: number;
  recentAdditions: number;
}

const ProgressTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaStats, isLoading: mediaLoading, refetch: refetchMedia } = useQuery({
    queryKey: ['media-stats'],
    queryFn: async () => {
      const { data: allMedia, error: allError } = await supabase
        .from('media')
        .select('id, created_at, is_visible');
      
      if (allError) throw allError;

      const visible = allMedia?.filter(m => m.is_visible).length || 0;
      const hidden = allMedia?.filter(m => !m.is_visible).length || 0;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recent = allMedia?.filter(m => new Date(m.created_at) > oneWeekAgo).length || 0;

      return {
        name: 'Media',
        total: allMedia?.length || 0,
        visible,
        hidden,
        recentAdditions: recent
      } as TableStats;
    }
  });

  const { data: peopleStats, isLoading: peopleLoading, refetch: refetchPeople } = useQuery({
    queryKey: ['people-stats'],
    queryFn: async () => {
      const { data: allPeople, error: allError } = await supabase
        .from('people')
        .select('id, created_at, is_visible');
      
      if (allError) {
        // Table might not exist yet
        return {
          name: 'People',
          total: 0,
          visible: 0,
          hidden: 0,
          recentAdditions: 0
        } as TableStats;
      }

      const visible = allPeople?.filter(p => p.is_visible).length || 0;
      const hidden = allPeople?.filter(p => !p.is_visible).length || 0;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recent = allPeople?.filter(p => new Date(p.created_at) > oneWeekAgo).length || 0;

      return {
        name: 'People',
        total: allPeople?.length || 0,
        visible,
        hidden,
        recentAdditions: recent
      } as TableStats;
    }
  });

  const handleRefresh = async () => {
    await Promise.all([refetchMedia(), refetchPeople()]);
    toast({
      title: "Refreshed",
      description: "Progress data has been updated",
    });
  };

  const stats = [mediaStats, peopleStats].filter(Boolean) as TableStats[];
  const isLoading = mediaLoading || peopleLoading;

  const visibilityPercentage = (stat: TableStats) => 
    stat.total > 0 ? Math.round((stat.visible / stat.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Progress Tracker</h2>
          <p className="text-muted-foreground">Monitor and track your content progress</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {stat.name}
                <Badge variant={stat.total > 0 ? "default" : "secondary"}>
                  {stat.total} Total
                </Badge>
              </CardTitle>
              <CardDescription>
                Content visibility and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Visibility Rate</span>
                  <span className="font-medium">{visibilityPercentage(stat)}%</span>
                </div>
                <Progress value={visibilityPercentage(stat)} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Visible</p>
                  <p className="text-2xl font-bold text-green-600">{stat.visible}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Hidden</p>
                  <p className="text-2xl font-bold text-muted-foreground">{stat.hidden}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                {stat.recentAdditions > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>{stat.recentAdditions}</strong> added this week
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No additions this week
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Visible</TableHead>
                <TableHead className="text-right">Hidden</TableHead>
                <TableHead className="text-right">Recent</TableHead>
                <TableHead className="text-right">Visibility %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((stat) => (
                  <TableRow key={stat.name}>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell className="text-right">{stat.total}</TableCell>
                    <TableCell className="text-right text-green-600">{stat.visible}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{stat.hidden}</TableCell>
                    <TableCell className="text-right">
                      {stat.recentAdditions > 0 ? (
                        <Badge variant="secondary">{stat.recentAdditions}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={visibilityPercentage(stat) > 50 ? "default" : "outline"}>
                        {visibilityPercentage(stat)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
