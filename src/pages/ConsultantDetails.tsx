import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import TaskDialog from "@/components/projects/TaskDialog";
import { useNavigate } from "react-router-dom";
import { ConsultantPaymentInfo } from "@/components/consultants/ConsultantPaymentInfo";

const ConsultantDetails = () => {
  const { projectId, consultantId } = useParams();
  const navigate = useNavigate();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const { data: projectConsultant } = useQuery({
    queryKey: ["project_consultant", projectId, consultantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select(`
          *,
          consultant:consultants(*)
        `)
        .eq("project_id", projectId)
        .eq("consultant_id", consultantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!projectConsultant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/project/${projectId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{projectConsultant.consultant.name}</h1>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Contact Information</p>
            <p>{projectConsultant.consultant.email}</p>
            {projectConsultant.consultant.phone && (
              <p>{projectConsultant.consultant.phone}</p>
            )}
            {projectConsultant.consultant.company_name && (
              <p>{projectConsultant.consultant.company_name}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <Button onClick={() => setTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            {/* Task list will be implemented here */}
          </div>

          <ConsultantPaymentInfo projectConsultant={projectConsultant} />
        </div>

        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          projectConsultantId={projectConsultant.id}
        />
      </Container>
    </div>
  );
};

export default ConsultantDetails;