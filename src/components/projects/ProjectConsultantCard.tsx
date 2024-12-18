import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import TaskDialog from "./TaskDialog";
import { FeeProposalStatus } from "../consultants/FeeProposalStatus";

interface ProjectConsultantCardProps {
  projectConsultant: {
    id: string;
    quote?: number | null;
    quote_status: string;
    fee_proposal_status?: string;
    consultant: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    };
  };
}

const ProjectConsultantCard = ({
  projectConsultant,
}: ProjectConsultantCardProps) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            {projectConsultant.consultant.name}
          </CardTitle>
          {projectConsultant.quote_status === "Approved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTaskDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm">
              <p className="text-muted-foreground">
                {projectConsultant.consultant.email}
              </p>
              {projectConsultant.consultant.company_name && (
                <p className="text-muted-foreground">
                  {projectConsultant.consultant.company_name}
                </p>
              )}
            </div>

            {projectConsultant.quote && (
              <div>
                <p className="text-sm font-medium">Quote</p>
                <p className="text-2xl font-bold">
                  ${projectConsultant.quote.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {projectConsultant.quote_status}
                </p>
              </div>
            )}

            <FeeProposalStatus projectConsultant={projectConsultant} />
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        projectConsultantId={projectConsultant.id}
      />
    </>
  );
};

export default ProjectConsultantCard;