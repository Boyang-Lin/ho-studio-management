import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminSection = () => {
  const { data: staffCount = 0 } = useQuery({
    queryKey: ["staffCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq('user_type', 'staff');
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: clientCount = 0 } = useQuery({
    queryKey: ["clientCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq('user_type', 'client');
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: projectCount = 0 } = useQuery({
    queryKey: ["projectCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: consultantCount = 0 } = useQuery({
    queryKey: ["consultantCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("consultants")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Consultants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{consultantCount}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminSection;