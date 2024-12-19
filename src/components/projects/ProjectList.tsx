import GroupedProjectList from "./GroupedProjectList";
import { Project } from "@/types/project";

interface ProjectListProps {
  projects: Array<Project>;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const ProjectList = ({ projects, onEdit, onDelete, onNew }: ProjectListProps) => {
  return (
    <GroupedProjectList
      projects={projects}
      onEdit={onEdit}
      onDelete={onDelete}
      onNew={onNew}
    />
  );
};

export default ProjectList;