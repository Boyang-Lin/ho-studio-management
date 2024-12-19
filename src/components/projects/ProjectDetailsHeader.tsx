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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Design Stage":
      return "bg-blue-100 text-blue-800";
    case "Coordination Stage":
      return "bg-purple-100 text-purple-800";
    case "Submitted":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "On hold":
      return "bg-orange-100 text-orange-800";
    case "Canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className={`${getStatusColor(status)} rounded-full text-xs font-medium px-2.5 py-0.5`}
                  >
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