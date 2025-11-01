import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Media {
  id: string;
  created_at: string;
  description: string | null;
  type: 'video' | 'photo';
  storage_path: string;
  display_order: number;
  is_visible: boolean;
}

export const useMedia = (type?: 'video' | 'photo') => {
  return useQuery({
    queryKey: ['media', type],
    queryFn: async () => {
      let query = supabase
        .from('media')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data
    },
  });
};
