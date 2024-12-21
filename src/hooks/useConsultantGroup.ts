import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useConsultantGroup = (consultantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentGroupId = async () => {
    if (!consultantId) return '';
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultant_group_memberships')
        .select('group_id')
        .eq('consultant_id', consultantId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching group ID:', error);
        return '';
      }
      
      return data?.group_id || '';
    } catch (error) {
      console.error('Error in getCurrentGroupId:', error);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  return { getCurrentGroupId, isLoading };
};