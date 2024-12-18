import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConsultantPaymentInfo } from "./ConsultantPaymentInfo";
import { Button } from "@/components/ui/button";
import { Plus, User, Building2, Mail } from "lucide-react";
import TaskDialog from "@/components/projects/TaskDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaskListItem } from "./task/TaskListItem";

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

const getNextStatus = (currentStatus: string) => {
  const statuses = ["Pending Input", "In Progress", "Completed"];
  const currentIndex = statuses.indexOf(currentStatus);
  return statuses[(currentIndex + 1) % statuses.length];
};

const EngagedConsultantCardWithDialog = ({
  projectConsultant,
}: EngagedConsultantCardWithDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("consultant_tasks")
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["consultant_tasks"] });
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task",
      });
    }
  };

  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    const newStatus = getNextStatus(currentStatus);
    
    try {
      const { error } = await supabase
        .from("consultant_tasks")
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["consultant_tasks"] });
      
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status",
      });
    }
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
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                      getTaskStatusColor={getTaskStatusColor}
                    />
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