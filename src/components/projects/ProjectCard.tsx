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

  const { data: assignedUsers = [] } = useQuery({
    queryKey: ["project_assignments", project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_assignments")
        .select("user_id, profiles(id, full_name)")
        .eq("project_id", project.id);

      if (error) throw error;
      return data.map((assignment) => assignment.profiles);
    },
  });

  const handleAssignUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("project_assignments")
        .insert({ project_id: project.id, user_id: userId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User assigned successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_assignments", project.id],
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

  const handleUnassignUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("project_assignments")
        .delete()
        .eq("project_id", project.id)
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User unassigned successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_assignments", project.id],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unassign user",
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
              currentAssignedUsers={assignedUsers}
              onAssign={handleAssignUser}
              onUnassign={handleUnassignUser}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;