import GroupedProjectList from "./GroupedProjectList";
import { Project } from "@/types/project";
import { useUserType } from "@/hooks/useUserType";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface ProjectListProps {
  projects: Array<Project>;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const ProjectList = ({ projects, onEdit, onDelete, onNew }: ProjectListProps) => {
  const userType = useUserType();
  const isAdmin = useIsAdmin();

  // Show all projects without filtering
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