import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "./useIsAdmin";
import { useUserType } from "./useUserType";

export const useProjects = () => {
  const isAdmin = useIsAdmin();
  const userType = useUserType();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // If user is not admin
      if (!isAdmin) {
        if (userType === 'staff') {
          // Staff can see projects they created, are assigned to, or are in project_assignments
          query = query.or(
            `user_id.eq.${user.id},` +
            `assigned_staff_id.eq.${user.id},` +
            `id.in.(${
              supabase
                .from('project_assignments')
                .select('project_id')
                .eq('user_id', user.id)
                .then(({ data }) => data?.map(d => d.project_id))
            })`
          );
        } else if (userType === 'client') {
          // Clients can only see projects assigned to them
          query = query.or(
            `assigned_client_id.eq.${user.id},` +
            `id.in.(${
              supabase
                .from('project_assignments')
                .select('project_id')
                .eq('user_id', user.id)
                .then(({ data }) => data?.map(d => d.project_id))
            })`
          );
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