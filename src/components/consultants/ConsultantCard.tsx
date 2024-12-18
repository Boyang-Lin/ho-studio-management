import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, User } from "lucide-react";
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
  };
  onEdit: (consultant: any) => void;
  onDelete: (id: string) => void;
}

const ConsultantCard = ({ consultant, onEdit, onDelete }: ConsultantCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(consultant)}
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
                  onClick={() => onDelete(consultant.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{consultant.name}</CardTitle>
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