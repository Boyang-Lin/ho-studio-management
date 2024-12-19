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

      // First, get project IDs from assignments if needed
      let assignedProjectIds: string[] = [];
      if (!isAdmin) {
        const { data: assignments, error: assignmentsError } = await supabase
          .from('project_assignments')
          .select('project_id')
          .eq('user_id', user.id);

        if (assignmentsError) {
          console.error("Error fetching assignments:", assignmentsError);
          throw assignmentsError;
        }

        assignedProjectIds = assignments?.map(a => a.project_id) || [];
      }

      // Build the main query
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // If user is not admin
      if (!isAdmin) {
        if (userType === 'staff') {
          // Staff can see projects they created, are assigned to, or are in project_assignments
          query = query.or(
            `user_id.eq.${user.id},assigned_staff_id.eq.${user.id}${
              assignedProjectIds.length > 0 
                ? `,id.in.(${assignedProjectIds.join(',')})` 
                : ''
            }`
          );
        } else if (userType === 'client') {
          // Clients can only see projects assigned to them
          query = query.or(
            `assigned_client_id.eq.${user.id}${
              assignedProjectIds.length > 0 
                ? `,id.in.(${assignedProjectIds.join(',')})` 
                : ''
            }`
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