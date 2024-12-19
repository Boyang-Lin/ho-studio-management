import ProjectHeader from "./ProjectHeader";
import ProjectInfo from "./ProjectInfo";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserType } from "@/hooks/useUserType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectDetailsHeaderProps {
  project: {
    id: string;
    name: string;
    description?: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
    status: string;
  };
}

const PROJECT_STATUSES = [
  "Design Stage",
  "Coordination Stage",
  "Submitted",
  "Approved",
  "On hold",
  "Canceled",
] as const;

export const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  const isAdmin = useIsAdmin();
  const userType = useUserType();
  const isStaff = userType === 'staff' || isAdmin;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", project.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      
      toast({
        title: "Success",
        description: "Project status updated successfully",
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project status",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <ProjectHeader projectName={project.name} />
        {isStaff && (
          <div className="min-w-[200px]">
            <Select
              value={project.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectInfo project={project} />
      </div>
    </div>
  );
};