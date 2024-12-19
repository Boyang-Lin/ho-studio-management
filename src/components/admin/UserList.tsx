import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserGroupSection from "./UserGroupSection";

const UserList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all users' emails
      const { data: authUsers, error: authError } = await supabase
        .from("auth.users")
        .select("id, email");

      if (authError) throw authError;

      // Combine the data
      return profiles.map((profile: any) => {
        const authUser = authUsers.find((user: any) => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || "N/A",
        };
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User information updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user information",
      });
      console.error("Error updating user:", error);
    },
  });

  const handleSave = (id: string, values: { role: string }) => {
    updateUserMutation.mutate({ id, role: values.role });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const staffUsers = users.filter(user => user.user_type === 'staff');
  const clientUsers = users.filter(user => user.user_type === 'client');

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Registered Users</h2>
      <UserGroupSection
        title="Staff Users"
        users={staffUsers}
        onSave={handleSave}
      />
      <UserGroupSection
        title="Client Users"
        users={clientUsers}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserList;