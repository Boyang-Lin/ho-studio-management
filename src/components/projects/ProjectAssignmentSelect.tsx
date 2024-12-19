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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ProjectAssignmentSelectProps {
  projectId: string;
  currentAssignedUsers: Array<{ id: string; full_name: string }>;
  onAssign: (userId: string) => void;
  onUnassign: (userId: string) => void;
}

const ProjectAssignmentSelect = ({
  projectId,
  currentAssignedUsers = [], // Provide default empty array
  onAssign,
  onUnassign,
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
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-between" disabled>
          Loading users...
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select users to assign
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-64">
                {users.map((user) => {
                  const isAssigned = currentAssignedUsers.some(
                    (u) => u.id === user.id
                  );
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => {
                        if (isAssigned) {
                          onUnassign(user.id);
                        } else {
                          onAssign(user.id);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isAssigned ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.full_name}
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {(currentAssignedUsers || []).map((user) => (
          <Badge
            key={user.id}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onUnassign(user.id)}
          >
            {user.full_name}
            <span className="ml-1">×</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProjectAssignmentSelect;