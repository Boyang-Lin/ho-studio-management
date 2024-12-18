import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import ConsultantCard from "./ConsultantCard";
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

interface ConsultantGroupProps {
  group: {
    id: string;
    name: string;
    consultants: Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    }>;
  };
  onEditGroup?: (group: any) => void;
  onDeleteGroup?: (id: string) => void;
  onEditConsultant?: (consultant: any) => void;
  onDeleteConsultant?: (id: string) => void;
  onAssignConsultant?: (consultant: any) => void;
  assignedConsultantIds?: string[];
  variant?: 'default' | 'selection';
  projectConsultants?: Array<{
    id: string;
    consultant_id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      name: string;
    };
  }>;
}

const ConsultantGroup = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onEditConsultant,
  onDeleteConsultant,
  onAssignConsultant,
  assignedConsultantIds = [],
  variant = 'default',
  projectConsultants = [],
}: ConsultantGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelectionVariant = variant === 'selection';

  return (
    <Card>
      <CardHeader className="relative">
        {!isSelectionVariant && (
          <div className="absolute top-4 right-4 flex space-x-2">
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
                  <AlertDialogAction
                    onClick={() => onDeleteGroup?.(group.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <div className="flex items-center justify-between pr-24">
          <CardTitle>{group.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.consultants?.map((consultant) => {
              const projectConsultant = projectConsultants.find(
                pc => pc.consultant_id === consultant.id
              );
              
              // Transform the projectConsultant to include the consultant name
              const transformedProjectConsultant = projectConsultant ? {
                ...projectConsultant,
                consultant: {
                  name: consultant.name
                }
              } : undefined;

              return (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onEdit={onEditConsultant}
                  onDelete={onDeleteConsultant}
                  onAssign={onAssignConsultant}
                  isAssigned={assignedConsultantIds.includes(consultant.id)}
                  variant={variant}
                  projectConsultant={transformedProjectConsultant}
                />
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConsultantGroup;