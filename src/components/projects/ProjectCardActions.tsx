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

interface ProjectCardActionsProps {
  projectId: string;
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
}

export const ProjectCardActions = ({
  projectId,
  onEdit,
  onDelete,
}: ProjectCardActionsProps) => {
  return (
    <div 
      className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" 
      onClick={(e) => e.stopPropagation()}
    >
      <Button variant="ghost" size="icon" onClick={() => onEdit(projectId)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(projectId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};