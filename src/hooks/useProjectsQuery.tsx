import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "./useIsAdmin";
import { useUserType } from "./useUserType";

export const useProjectsQuery = () => {
  const isAdmin = useIsAdmin();
  const userType = useUserType();

  return useQuery({
    queryKey: ["projects", userType, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // Admin sees all projects
      if (isAdmin) {
        const { data, error } = await query;
        if (error) throw error;
        return data;
      }

      // Staff sees only assigned projects
      if (userType === 'staff') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('assigned_staff_id', user.id);
        }
      }

      // Client sees only assigned projects
      if (userType === 'client') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('assigned_client_id', user.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      return data;
    },
  });
};