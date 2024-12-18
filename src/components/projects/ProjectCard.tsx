import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProjectCardActions } from "./ProjectCardActions";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDetails } from "./ProjectDetails";

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
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md group"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <ProjectStatusBadge status={project.status} />
          <ProjectCardActions
            projectId={project.id}
            onEdit={() => onEdit(project)}
            onDelete={onDelete}
          />
        </div>
        <ProjectDetails project={project} />
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;