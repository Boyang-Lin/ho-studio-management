import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserTableRow from "./UserTableRow";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  user_type: string;
  auth_user: {
    email: string;
  };
}

interface UserGroupSectionProps {
  title: string;
  users: User[];
  onSave: (id: string, values: { role: string; full_name: string }) => void;
}

const UserGroupSection = ({ title, users, onSave }: UserGroupSectionProps) => {
  if (users.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} onSave={onSave} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserGroupSection;