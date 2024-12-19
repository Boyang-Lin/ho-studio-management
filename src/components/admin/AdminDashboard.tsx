import AdminSection from "./AdminSection";
import UserList from "./UserList";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <AdminSection />
      <UserList />
    </div>
  );
};

export default AdminDashboard;