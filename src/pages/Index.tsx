import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <Container className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold">Project Management</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </Container>
      </header>
      <Container className="py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome to Project Management</h2>
          <p className="text-muted-foreground">
            Start managing your projects and consultants
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Index;