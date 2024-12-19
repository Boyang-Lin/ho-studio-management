import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProjectCardActions } from "./ProjectCardActions";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDetails } from "./ProjectDetails";
import ProjectAssignmentSelect from "./ProjectAssignmentSelect";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAssignUser = async (userId: string | null) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ assigned_user_id: userId })
        .eq("id", project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project assignment updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project assignment",
      });
    }
  };

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
        {isAdmin && (
          <div onClick={(e) => e.stopPropagation()}>
            <ProjectAssignmentSelect
              projectId={project.id}
              currentAssignedUserId={project.assigned_user_id}
              onAssign={handleAssignUser}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;