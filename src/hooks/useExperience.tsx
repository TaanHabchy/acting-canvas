import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ExperienceType = {
  film: string;
  short_film: string;
  tv: string;
  commercial: string;
  theatre: string;
  training: string;
}

export interface Experience {
  id: string;
  created_at: string;
  title: string;
  studio: string;
  director: string;
  role: string;
  type: keyof ExperienceType;
  display_order: number;
}

export const useExperience = (
    categories?: Array<'experience' | 'training' | 'skill' | 'short film' | 'theatre' | 'tv'>
) => {
  return useQuery({
    queryKey: ['experience', categories],
    queryFn: async () => {
      let query = supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true });

      if (categories && categories.length > 0) {
        query = query.in('type', categories);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log('data', data);
      return data as Experience[];
    },
  });
};
