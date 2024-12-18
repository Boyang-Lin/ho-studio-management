import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ConsultantGroup from "@/components/consultants/ConsultantGroup";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectInfo from "@/components/projects/ProjectInfo";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: projectConsultants = [], isLoading: consultantsLoading } = useQuery({
    queryKey: ["project_consultants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select(`
          *,
          consultant:consultants(*)
        `)
        .eq("project_id", id);

      if (error) throw error;
      return data;
    },
  });

  const { data: consultantGroups = [] } = useQuery({
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

  const handleAssignConsultant = async (consultant: any) => {
    const isAssigned = projectConsultants.some(pc => pc.consultant_id === consultant.id);
    
    try {
      if (isAssigned) {
        // Remove consultant
        const { error } = await supabase
          .from("project_consultants")
          .delete()
          .eq("project_id", id)
          .eq("consultant_id", consultant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Consultant removed successfully",
        });
      } else {
        // Assign consultant
        const { error } = await supabase
          .from("project_consultants")
          .insert({
            project_id: id,
            consultant_id: consultant.id,
          });

        if (error) throw error;

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

  if (projectLoading || consultantsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  const assignedConsultantIds = projectConsultants.map(pc => pc.consultant_id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8 space-y-8">
        <div className="space-y-6">
          <ProjectHeader 
            projectName={project.name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectInfo project={project} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">All Consultants</h2>
          <div className="space-y-6">
            {consultantGroups?.map((group) => (
              <ConsultantGroup
                key={group.id}
                group={group}
                variant="selection"
                onAssignConsultant={handleAssignConsultant}
                assignedConsultantIds={assignedConsultantIds}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProjectDetails;
