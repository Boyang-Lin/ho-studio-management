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
    }>;
  };
  onEditGroup: (group: any) => void;
  onDeleteGroup: (id: string) => void;
  onEditConsultant: (consultant: any) => void;
  onDeleteConsultant: (id: string) => void;
}

const ConsultantGroup = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onEditConsultant,
  onDeleteConsultant,
}: ConsultantGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card>
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditGroup(group)}
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
                  onClick={() => onDeleteGroup(group.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            {group.consultants?.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onEdit={onEditConsultant}
                onDelete={onDeleteConsultant}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConsultantGroup;