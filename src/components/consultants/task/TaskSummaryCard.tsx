import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import TaskDialog from "@/components/projects/TaskDialog";
import { PendingTaskListItem } from "./PendingTaskListItem";

interface TaskSummaryCardProps {
  projectConsultantId: string;
  readOnly?: boolean;
}

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

export const TaskSummaryCard = ({ projectConsultantId, readOnly = false }: TaskSummaryCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ["consultant_tasks", projectConsultantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultant_tasks")
        .select("*")
        .eq("project_consultant_id", projectConsultantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    if (readOnly) return;
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

  const handleDeleteTask = async (taskId: string) => {
    if (readOnly) return;
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

  const handleEditTask = (task: any) => {
    if (readOnly) return;
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const incompleteTasks = tasks.filter(task => task.status !== "Completed");

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Pending Tasks</CardTitle>
          {!readOnly && (
            <Button
              size="sm"
              onClick={() => {
                setSelectedTask(null);
                setTaskDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incompleteTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">No pending tasks</p>
            ) : (
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <PendingTaskListItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    getTaskStatusColor={getTaskStatusColor}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          projectConsultantId={projectConsultantId}
          task={selectedTask}
        />
      )}
    </>
  );
};