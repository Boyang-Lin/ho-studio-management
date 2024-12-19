import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectAssignmentSelectProps {
  projectId: string;
  currentAssignedUserId: string | null;
  onAssign: (userId: string | null) => void;
}

const ProjectAssignmentSelect = ({
  projectId,
  currentAssignedUserId,
  onAssign,
}: ProjectAssignmentSelectProps) => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Select
      value={currentAssignedUserId || ""}
      onValueChange={(value) => onAssign(value || null)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign to user" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Unassigned</SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectAssignmentSelect;