import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
    status: string;
  }>;
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const ProjectList = ({ projects, onEdit, onDelete, onNew }: ProjectListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={onNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;