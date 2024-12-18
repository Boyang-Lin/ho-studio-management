import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConsultantAssignmentDialog from "@/components/projects/ConsultantAssignmentDialog";
import ProjectConsultantCard from "@/components/projects/ProjectConsultantCard";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Button onClick={() => setAssignmentDialogOpen(true)}>
              Assign Consultant
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Project Details</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Client</dt>
                  <dd>{project.client_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Contact</dt>
                  <dd>{project.client_contact}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd>{project.client_email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Estimated Cost</dt>
                  <dd>${project.estimated_cost.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>{project.status}</dd>
                </div>
                {project.description && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Description</dt>
                    <dd>{project.description}</dd>
                  </div>
                )}
              </dl>
            </div>

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