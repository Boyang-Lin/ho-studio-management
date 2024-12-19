import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserType } from "@/hooks/useUserType";
import { ProjectCardActions } from "./ProjectCardActions";
import { Project } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectActionsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectActions = ({ project, onEdit, onDelete }: ProjectActionsProps) => {
  const isAdmin = useIsAdmin();
  const userType = useUserType();
  const isStaff = userType === "staff";

  // Get current user's ID using React Query to handle the async nature of the call
  const { data: currentUserId } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    },
  });

  const isProjectOwner = project.user_id === currentUserId;

  // Only show actions for admins or staff who own the project
  // Clients should never see edit/delete actions
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