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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PendingTaskListItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    due_date?: string;
  };
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  getTaskStatusColor: (status: string) => string;
  readOnly?: boolean;
}

export const PendingTaskListItem = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  getTaskStatusColor,
  readOnly = false,
}: PendingTaskListItemProps) => {
  const statusOptions = ["Pending Input", "In Progress", "Completed"];

  return (
    <div className="p-3 rounded-lg border bg-card relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {!readOnly && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
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
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      <h4 className="font-medium pr-20">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        {readOnly ? (
          <Badge className={getTaskStatusColor(task.status)}>
            {task.status}
          </Badge>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`px-2 py-1 h-auto font-normal ${getTaskStatusColor(task.status)}`}
              >
                {task.status}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(task.id, status)}
                  className="cursor-pointer"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {task.due_date && (
          <span className="text-sm text-muted-foreground">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};