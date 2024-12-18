import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskSummaryCardProps {
  projectConsultantId: string;
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

export const TaskSummaryCard = ({ projectConsultantId }: TaskSummaryCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const incompleteTasks = tasks.filter(task => task.status !== "Completed");
  const statusOptions = ["Pending Input", "In Progress", "Completed"];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incompleteTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">No pending tasks</p>
          ) : (
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className={`px-2 py-1 h-auto font-normal ${getTaskStatusColor(task.status)}`}
                        >
                          {task.status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        {statusOptions.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(task.id, status)}
                            className="cursor-pointer"
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.due_date && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};