import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, User, Trash2 } from "lucide-react";
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

interface ConsultantCardProps {
  consultant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
  onEdit?: (consultant: any) => void;
  onDelete?: (id: string) => void;
  onAssign?: (consultant: any) => void;
  isAssigned?: boolean;
  variant?: 'default' | 'selection';
}

const ConsultantCard = ({ 
  consultant, 
  onEdit, 
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default'
}: ConsultantCardProps) => {
  const isSelectionVariant = variant === 'selection';

  return (
    <Card className="bg-white">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          {isSelectionVariant ? (
            <Checkbox
              checked={isAssigned}
              onCheckedChange={() => onAssign?.(consultant)}
              aria-label={isAssigned ? "Remove consultant" : "Assign consultant"}
            />
          ) : (
            <>
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
                    <AlertDialogAction
                      onClick={() => onDelete?.(consultant.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">{consultant.name}</CardTitle>
            {consultant.company_name && (
              <p className="text-sm text-muted-foreground">
                {consultant.company_name}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{consultant.email}</dd>
          </div>
          {consultant.phone && (
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{consultant.phone}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default ConsultantCard;