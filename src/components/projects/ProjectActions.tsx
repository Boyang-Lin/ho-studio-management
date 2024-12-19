import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserType } from "@/hooks/useUserType";
import { ProjectCardActions } from "./ProjectCardActions";
import { Project } from "@/types/project";

interface ProjectActionsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectActions = ({ project, onEdit, onDelete }: ProjectActionsProps) => {
  const isAdmin = useIsAdmin();
  const userType = useUserType();
  const isStaff = userType === "staff";
  const isProjectOwner = project.user_id === project.user_id;

  if (isAdmin || (isStaff && isProjectOwner)) {
    return (
      <ProjectCardActions
        projectId={project.id}
        onEdit={() => onEdit(project)}
        onDelete={onDelete}
      />
    );
  }

  return null;
};

export default ProjectActions;