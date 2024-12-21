import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useConsultantGroups = () => {
  return useQuery({
    queryKey: ["consultant_groups"],
    queryFn: async () => {
      // First, fetch all consultants
      const { data: allConsultants, error: consultantsError } = await supabase
        .from("consultants")
        .select("*")
        .order("name");

      if (consultantsError) throw consultantsError;

      // Fetch all groups with their consultants
      const { data: groups, error: groupsError } = await supabase
        .from("consultant_groups")
        .select(`
          *,
          consultants:consultant_group_memberships(
            consultant:consultants(*)
          )
        `)
        .order("name");

      if (groupsError) throw groupsError;

      // Transform groups data
      const transformedGroups = groups.map(group => ({
        ...group,
        consultants: group.consultants
          .map((membership: any) => membership.consultant)
          .filter(Boolean)
      }));

      // Find consultants that don't belong to any group
      const groupedConsultantIds = new Set(
        transformedGroups.flatMap(group => 
          group.consultants.map((consultant: any) => consultant.id)
        )
      );

      const ungroupedConsultants = allConsultants.filter(
        consultant => !groupedConsultantIds.has(consultant.id)
      );

      // Add an "Ungrouped" section if there are any ungrouped consultants
      if (ungroupedConsultants.length > 0) {
        transformedGroups.push({
          id: "ungrouped",
          name: "Ungrouped",
          consultants: ungroupedConsultants,
          user_id: null,
          created_at: null
        });
      }

      return transformedGroups;
    }
  });
};