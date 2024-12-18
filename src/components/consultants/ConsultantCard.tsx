import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ConsultantInfo } from "./ConsultantInfo";
import { QuoteInput } from "./QuoteInput";
import { ConsultantPaymentInfo } from "./ConsultantPaymentInfo";

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
  projectConsultant?: {
    id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      name: string;
    };
  };
}

const ConsultantCard = ({ 
  consultant, 
  onEdit, 
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default',
  projectConsultant,
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
        <ConsultantInfo consultant={consultant} />
      </CardHeader>
      {projectConsultant && (
        <CardContent>
          <div className="space-y-6">
            <QuoteInput projectConsultant={projectConsultant} />
            <ConsultantPaymentInfo projectConsultant={projectConsultant} />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConsultantCard;