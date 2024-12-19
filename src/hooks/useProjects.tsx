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

      // Build the base query
      let query = supabase
        .from("projects")
        .select("*");

      // Apply filters based on user type and permissions
      if (!isAdmin) {
        if (userType === 'staff') {
          query = query.or(`user_id.eq.${user.id},assigned_staff_id.eq.${user.id}`);
        } else if (userType === 'client') {
          query = query.or(`assigned_client_id.eq.${user.id}`);
        }
      }

      // Execute the query
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      // If not admin, also fetch projects from assignments
      if (!isAdmin) {
        const { data: assignedProjects, error: assignmentsError } = await supabase
          .from("projects")
          .select("*")
          .in("id", (
            await supabase
              .from("project_assignments")
              .select("project_id")
              .eq("user_id", user.id)
          ).data?.map(a => a.project_id) || [])
          .order("created_at", { ascending: false });

        if (assignmentsError) {
          console.error("Error fetching assigned projects:", assignmentsError);
          throw assignmentsError;
        }

        // Combine and deduplicate projects
        const allProjects = [...(data || []), ...(assignedProjects || [])];
        const uniqueProjects = Array.from(
          new Map(allProjects.map(project => [project.id, project])).values()
        );

        return uniqueProjects;
      }

      return data;
    },
  });
};