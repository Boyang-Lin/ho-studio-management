import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
    status: string;
  };
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Design Stage":
        return "bg-blue-100 text-blue-800";
      case "Coordination Stage":
        return "bg-purple-100 text-purple-800";
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "On hold":
        return "bg-orange-100 text-orange-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
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
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this project? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(project.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardTitle>{project.name}</CardTitle>
        {project.description && (
          <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Client Name</dt>
            <dd>{project.client_name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Contact</dt>
            <dd>{project.client_contact}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{project.client_email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estimated Cost</dt>
            <dd>${project.estimated_cost.toLocaleString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;