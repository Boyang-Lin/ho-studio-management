import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useConsultantGroups = () => {
  return useQuery({
    queryKey: ["consultant_groups"],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from("consultant_groups")
        .select("*, consultants:consultant_group_memberships(consultant:consultants(*))");

      if (groupsError) throw groupsError;

      return groups.map(group => ({
        ...group,
        consultants: group.consultants?.map((membership: any) => membership.consultant) || []
      }));
    },
  });
};