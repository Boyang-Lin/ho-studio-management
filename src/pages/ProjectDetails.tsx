import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { useToast } from "@/hooks/use-toast";
import ConsultantAssignmentDialog from "@/components/projects/ConsultantAssignmentDialog";
import ProjectConsultantCard from "@/components/projects/ProjectConsultantCard";
import { Loader2 } from "lucide-react";
import ConsultantGroup from "@/components/consultants/ConsultantGroup";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectInfo from "@/components/projects/ProjectInfo";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

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

  const handleEditConsultant = (consultant: any) => {
    // This will be implemented in the next iteration
    console.log("Edit consultant:", consultant);
  };

  const handleDeleteConsultant = async (id: string) => {
    // This will be implemented in the next iteration
    console.log("Delete consultant:", id);
  };

  const handleEditGroup = (group: any) => {
    // This will be implemented in the next iteration
    console.log("Edit group:", group);
  };

  const handleDeleteGroup = async (id: string) => {
    // This will be implemented in the next iteration
    console.log("Delete group:", id);
  };

  const handleAssignConsultant = async (consultant: any) => {
    try {
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
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign consultant",
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

  const pendingConsultants = projectConsultants.filter(
    (pc) => pc.quote_status === "Pending"
  );
  const approvedConsultants = projectConsultants.filter(
    (pc) => pc.quote_status === "Approved"
  );

  const assignedConsultantIds = projectConsultants.map(pc => pc.consultant_id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8 space-y-8">
        {/* Project Details Section */}
        <div className="space-y-6">
          <ProjectHeader 
            projectName={project.name}
            onAssignClick={() => setAssignmentDialogOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectInfo project={project} />

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pending Quotes</h2>
                <div className="grid gap-4">
                  {pendingConsultants.map((pc) => (
                    <ProjectConsultantCard
                      key={pc.id}
                      projectConsultant={pc}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Assigned Consultants</h2>
                <div className="grid gap-4">
                  {approvedConsultants.map((pc) => (
                    <ProjectConsultantCard
                      key={pc.id}
                      projectConsultant={pc}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultant List Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">All Consultants</h2>
          <div className="space-y-6">
            {consultantGroups?.map((group) => (
              <ConsultantGroup
                key={group.id}
                group={group}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
                onEditConsultant={handleEditConsultant}
                onDeleteConsultant={handleDeleteConsultant}
                showAssignButton={true}
                onAssignConsultant={handleAssignConsultant}
                assignedConsultantIds={assignedConsultantIds}
              />
            ))}
          </div>
        </div>
      </Container>

      <ConsultantAssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        projectId={id!}
      />
    </div>
  );
};

export default ProjectDetails;