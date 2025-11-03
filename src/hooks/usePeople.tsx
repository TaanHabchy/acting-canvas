import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type OutreachStatus = 'soon' | 'contacted' | 'conversation' | 'ghosted' | 'dub';

export interface Person {
  id: string;
  created_at: string;
  name: string;
  company?: string | null;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  outreach_status: OutreachStatus;
  is_visible: boolean;
  rating?: number | null;
}

export const usePeople = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Person[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OutreachStatus }) => {
      const { error } = await supabase
        .from('people')
        .update({ outreach_status: status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({
        title: "Status updated",
        description: "Person's outreach status has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    updateStatus,
  };
};
