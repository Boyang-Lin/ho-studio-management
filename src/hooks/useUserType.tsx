import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserType = () => {
  const { data: userType = 'staff' } = useQuery({
    queryKey: ["userType"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'staff';

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      return profile?.user_type || 'staff';
    },
  });

  return userType;
};