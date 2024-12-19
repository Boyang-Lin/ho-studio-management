import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProjectCardActions } from "./ProjectCardActions";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDetails } from "./ProjectDetails";
import ProjectAssignmentSelect from "./ProjectAssignmentSelect";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

  const { data: assignedUser } = useQuery({
    queryKey: ["project_assigned_user", project.id],
    queryFn: async () => {
      if (!project.assigned_user_id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", project.assigned_user_id)
        .single();

      if (error) {
        console.error("Error fetching assigned user:", error);
        return null;
      }

      return data;
    },
  });

  const handleAssignUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ assigned_user_id: userId })
        .eq("id", project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User assigned successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project_assigned_user", project.id],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign user",
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
              currentAssignedUser={assignedUser}
              onAssign={handleAssignUser}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;