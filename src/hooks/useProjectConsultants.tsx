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
  });

  const handleAssignConsultant = async (consultant: any) => {
    const isAssigned = query.data?.some(pc => pc.consultant_id === consultant.id);
    
    try {
      if (isAssigned) {
        const { error } = await supabase
          .from("project_consultants")
          .delete()
          .eq("project_id", projectId)
          .eq("consultant_id", consultant.id);

        if (error) throw error;

        queryClient.setQueryData(
          ["project_consultants", projectId],
          (oldData: any) => oldData.filter((pc: any) => pc.consultant_id !== consultant.id)
        );

        toast({
          title: "Success",
          description: "Consultant removed successfully",
        });
      } else {
        const { data: insertedData, error } = await supabase
          .from("project_consultants")
          .insert({
            project_id: projectId,
            consultant_id: consultant.id,
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
          (oldData: any) => [...(oldData || []), insertedData]
        );

        toast({
          title: "Success",
          description: "Consultant assigned successfully",
        });
      }
    } catch (error) {
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