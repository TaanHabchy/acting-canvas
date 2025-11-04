import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type StudioStatus = 'soon' | 'contacted' | 'conversation' | 'ghosted' | 'dub';

export interface Studio {
  id: number;
  created_at: string;
  name: string;
  website?: string | null;
  facebook?: string | null;
  location?: string | null;
  status: StudioStatus;
}

export const useStudios = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['studios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Studio[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: StudioStatus }) => {
      const { error } = await supabase
        .from('studios')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studios'] });
      toast({
        title: "Status updated",
        description: "Studio's outreach status has been updated",
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
