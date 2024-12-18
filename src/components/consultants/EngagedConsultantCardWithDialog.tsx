import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConsultantPaymentInfo } from "./ConsultantPaymentInfo";
import { Button } from "@/components/ui/button";
import { Plus, User, Building2, Mail, Pencil } from "lucide-react";
import TaskDialog from "@/components/projects/TaskDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EngagedConsultantCardWithDialogProps {
  projectConsultant: {
    id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    };
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Fee Proposal Signed":
      return "bg-green-100 text-green-800";
    case "Pending Approval":
      return "bg-yellow-100 text-yellow-800";
    case "Fee Proposal Received":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Pending Input":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const EngagedConsultantCardWithDialog = ({
  projectConsultant,
}: EngagedConsultantCardWithDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ["consultant_tasks", projectConsultant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultant_tasks")
        .select("*")
        .eq("project_consultant_id", projectConsultant.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow bg-white"
        onClick={() => setDialogOpen(true)}
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{projectConsultant.consultant.name}</CardTitle>
          </div>
          {projectConsultant.consultant.company_name && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{projectConsultant.consultant.company_name}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{projectConsultant.consultant.email}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectConsultant.quote && (
              <div>
                <p className="text-sm text-muted-foreground">Quote Amount</p>
                <p className="text-2xl font-bold">
                  ${projectConsultant.quote.toLocaleString()}
                </p>
              </div>
            )}
            <Badge className={`${getStatusColor(projectConsultant.quote_status)}`}>
              {projectConsultant.quote_status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{projectConsultant.consultant.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <ConsultantPaymentInfo projectConsultant={projectConsultant} />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button onClick={() => {
                  setSelectedTask(null);
                  setTaskDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                ) : (
                  tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 rounded-lg border bg-card text-card-foreground relative group"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="secondary"
                          className={getTaskStatusColor(task.status)}
                        >
                          {task.status}
                        </Badge>
                        {task.due_date && (
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        projectConsultantId={projectConsultant.id}
        task={selectedTask}
      />
    </>
  );
};

export default EngagedConsultantCardWithDialog;