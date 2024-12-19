import ProjectHeader from "./ProjectHeader";
import ProjectInfo from "./ProjectInfo";

interface ProjectDetailsHeaderProps {
  project: {
    name: string;
    description?: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
  };
}

export const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  return (
    <div className="space-y-6">
      <ProjectHeader projectName={project.name} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectInfo project={project} />
      </div>
    </div>
  );
};