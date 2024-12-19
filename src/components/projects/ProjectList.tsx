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

  // Filter out projects based on user type and permissions
  const filteredProjects = projects.filter(project => {
    if (isAdmin) return true; // Admin can see all projects
    if (userType === 'staff') return true; // Projects are already filtered at query level
    return false;
  });

  return (
    <GroupedProjectList
      projects={filteredProjects}
      onEdit={onEdit}
      onDelete={onDelete}
      onNew={onNew}
    />
  );
};

export default ProjectList;