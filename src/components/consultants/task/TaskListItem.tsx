import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskListItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    due_date?: string;
  };
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, currentStatus: string) => void;
  getTaskStatusColor: (status: string) => string;
}

export const TaskListItem = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  getTaskStatusColor,
}: TaskListItemProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h4 className="font-medium">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Badge 
          variant="secondary"
          className={`${getTaskStatusColor(task.status)} cursor-pointer hover:opacity-80`}
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, task.status);
          }}
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
  );
};