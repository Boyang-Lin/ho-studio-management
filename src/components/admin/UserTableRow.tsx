import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  user_type: string;
  email: string;
}

interface UserTableRowProps {
  user: User;
  onSave: (id: string, values: { role: string; full_name: string; user_type: string }) => void;
}

const UserTableRow = ({ user, onSave }: UserTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    role: user.role || "",
    full_name: user.full_name || "",
    user_type: user.user_type || "staff"
  });

  const handleSave = () => {
    onSave(user.id, editValues);
    setIsEditing(false);
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={editValues.full_name}
            onChange={(e) =>
              setEditValues({ ...editValues, full_name: e.target.value })
            }
            placeholder="Enter full name"
          />
        ) : (
          user.full_name || "N/A"
        )}
      </TableCell>
      <TableCell>{user.email || "N/A"}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editValues.role}
            onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
            placeholder="Enter role"
          />
        ) : (
          user.role || "N/A"
        )}
      </TableCell>
      <TableCell>{user.is_admin ? "Admin" : "User"}</TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editValues.user_type}
            onValueChange={(value) => setEditValues({ ...editValues, user_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          user.user_type
        )}
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditValues({
                  role: user.role || "",
                  full_name: user.full_name || "",
                  user_type: user.user_type || "staff"
                });
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;