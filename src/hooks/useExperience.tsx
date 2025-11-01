import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Experience {
  id: string;
  created_at: string;
  title: string;
  company: string;
  year: string;
  description: string;
  category: 'experience' | 'training' | 'skills';
  display_order: number;
}

export const useExperience = (category?: 'experience' | 'training' | 'skills') => {
  return useQuery({
    queryKey: ['experience', category],
    queryFn: async () => {
      let query = supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Experience[];
    },
  });
};
