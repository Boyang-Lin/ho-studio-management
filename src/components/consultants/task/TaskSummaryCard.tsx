import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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

  const incompleteTasks = tasks.filter(task => task.status !== "Completed");

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
                    <Badge className={getTaskStatusColor(task.status)}>
                      {task.status}
                    </Badge>
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