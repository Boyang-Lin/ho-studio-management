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

  const tasksByStatus = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const totalTasks = tasks.length;
  const completedTasks = tasksByStatus["Completed"] || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Tasks Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1">{progress}% Complete</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status Breakdown</p>
            <div className="space-y-1">
              {Object.entries(tasksByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge className={`${getTaskStatusColor(status)}`}>
                    {status}
                  </Badge>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">No tasks yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};