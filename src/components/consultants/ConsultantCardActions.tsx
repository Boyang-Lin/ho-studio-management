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
import { Checkbox } from "@/components/ui/checkbox";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface ConsultantCardActionsProps {
  consultantId: string;
  onEdit?: (consultant: any) => void;
  onDelete?: (id: string) => void;
  onAssign?: (consultant: any) => void;
  isAssigned?: boolean;
  variant?: 'default' | 'selection';
  consultant?: any;
}

export const ConsultantCardActions = ({
  consultantId,
  onEdit,
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default',
  consultant,
}: ConsultantCardActionsProps) => {
  const isAdmin = useIsAdmin();
  const isSelectionVariant = variant === 'selection';

  if (isSelectionVariant) {
    return (
      <Checkbox
        checked={isAssigned}
        onCheckedChange={() => onAssign?.(consultantId)}
        aria-label={isAssigned ? "Remove consultant" : "Assign consultant"}
      />
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit?.(consultant)}
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
            <AlertDialogTitle>Delete Consultant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this consultant? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete?.(consultantId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};