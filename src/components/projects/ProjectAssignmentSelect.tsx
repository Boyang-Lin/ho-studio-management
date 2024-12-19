import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface ProjectAssignmentSelectProps {
  projectId: string;
  currentAssignedUser?: { id: string; full_name: string } | null;
  onAssign?: (userId: string) => void;
}

const ProjectAssignmentSelect = ({
  projectId,
  currentAssignedUser,
  onAssign,
}: ProjectAssignmentSelectProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users",
        });
        return [];
      }

      return profiles || [];
    },
  });

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        Loading users...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentAssignedUser?.full_name || "Select user to assign"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  onAssign?.(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentAssignedUser?.id === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.full_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectAssignmentSelect;