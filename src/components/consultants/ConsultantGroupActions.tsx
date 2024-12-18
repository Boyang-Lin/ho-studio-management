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

interface ConsultantGroupActionsProps {
  group: {
    id: string;
    name: string;
  };
  onEditGroup?: (group: any) => void;
  onDeleteGroup?: (id: string) => void;
  variant?: 'default' | 'selection';
}

export const ConsultantGroupActions = ({
  group,
  onEditGroup,
  onDeleteGroup,
  variant = 'default'
}: ConsultantGroupActionsProps) => {
  if (variant === 'selection') return null;

  return (
    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditGroup?.(group)}
      >
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
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteGroup?.(group.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};