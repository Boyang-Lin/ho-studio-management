import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProjectCardActions } from "./ProjectCardActions";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDetails } from "./ProjectDetails";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@/types/project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

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

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, user_type");
      
      if (error) throw error;
      return data;
    },
  });

  const staffUsers = users.filter(user => user.user_type === 'staff');
  const clientUsers = users.filter(user => user.user_type === 'client');

  const handleAssignUser = async (userId: string | null, type: 'staff' | 'client') => {
    try {
      const updateField = type === 'staff' ? 'assigned_staff_id' : 'assigned_client_id';
      const { error } = await supabase
        .from("projects")
        .update({ [updateField]: userId })
        .eq("id", project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'staff' ? 'Staff' : 'Client'} assignment updated successfully`,
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
          <div onClick={(e) => e.stopPropagation()} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assigned Staff</label>
              <Select
                value={project.assigned_staff_id || "unassigned"}
                onValueChange={(value) => handleAssignUser(value === "unassigned" ? null : value, 'staff')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Assign staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {staffUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assigned Client</label>
              <Select
                value={project.assigned_client_id || "unassigned"}
                onValueChange={(value) => handleAssignUser(value === "unassigned" ? null : value, 'client')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Assign client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {clientUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;