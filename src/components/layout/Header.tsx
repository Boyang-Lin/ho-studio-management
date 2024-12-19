import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Container from "@/components/Container";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm">
      <Container className="flex items-center justify-between h-16">
        <h1 className="text-xl font-semibold">HO Studio Management</h1>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </Container>
    </header>
  );
};

export default Header;