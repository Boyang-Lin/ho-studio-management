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

      // If user is not admin and is staff, only show assigned projects
      if (!isAdmin) {
        if (userType === 'staff') {
          query = query.or(`assigned_staff_id.eq.${user.id},user_id.eq.${user.id}`);
        }
      }
      // Admin users will get all projects as no filter is applied

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};