import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const UserList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ company: "", role: "" });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return profiles;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, company, role }: { id: string; company: string; role: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ company, role })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User information updated successfully",
      });
      setEditingUser(null);
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

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    setEditValues({
      company: user.company || "",
      role: user.role || "",
    });
  };

  const handleSave = async (id: string) => {
    updateUserMutation.mutate({
      id,
      company: editValues.company,
      role: editValues.role,
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditValues({ company: "", role: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Registered Users</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>
                {editingUser === user.id ? (
                  <Input
                    value={editValues.company}
                    onChange={(e) =>
                      setEditValues({ ...editValues, company: e.target.value })
                    }
                    placeholder="Enter company"
                  />
                ) : (
                  user.company || "N/A"
                )}
              </TableCell>
              <TableCell>
                {editingUser === user.id ? (
                  <Input
                    value={editValues.role}
                    onChange={(e) =>
                      setEditValues({ ...editValues, role: e.target.value })
                    }
                    placeholder="Enter role"
                  />
                ) : (
                  user.role || "N/A"
                )}
              </TableCell>
              <TableCell>{user.is_admin ? "Admin" : "User"}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {editingUser === user.id ? (
                  <div className="space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSave(user.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;