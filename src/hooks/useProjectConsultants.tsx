import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProjectConsultants = (projectId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project_consultants", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select(`
          *,
          consultant:consultants(
            id,
            name,
            email,
            phone,
            company_name
          )
        `)
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const handleAssignConsultant = async (consultant: any) => {
    if (!projectId) return;

    const isAssigned = query.data?.some(pc => pc.consultant_id === consultant);
    
    try {
      if (isAssigned) {
        const { error } = await supabase
          .from("project_consultants")
          .delete()
          .eq("project_id", projectId)
          .eq("consultant_id", consultant);

        if (error) throw error;

        queryClient.setQueryData(
          ["project_consultants", projectId],
          (oldData: any) => (oldData || []).filter((pc: any) => pc.consultant_id !== consultant)
        );

        toast({
          title: "Success",
          description: "Consultant removed successfully",
        });
      } else {
        const { data, error } = await supabase
          .from("project_consultants")
          .insert({
            project_id: projectId,
            consultant_id: consultant,
          })
          .select(`
            *,
            consultant:consultants(
              id,
              name,
              email,
              phone,
              company_name
            )
          `)
          .single();

        if (error) throw error;

        queryClient.setQueryData(
          ["project_consultants", projectId],
          (oldData: any) => [...(oldData || []), data]
        );

        toast({
          title: "Success",
          description: "Consultant assigned successfully",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isAssigned ? "Failed to remove consultant" : "Failed to assign consultant",
      });
    }
  };

  return {
    ...query,
    handleAssignConsultant,
  };
};