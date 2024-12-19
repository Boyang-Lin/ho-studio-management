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

      // For staff and admins, fetch all projects
      if (userType === 'staff' || isAdmin) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          throw error;
        }

        return data;
      }

      // For clients, only fetch assigned projects
      if (userType === 'client') {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("assigned_client_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching client projects:", error);
          throw error;
        }

        return data;
      }

      return [];
    },
  });
};