import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Container from "@/components/Container";

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm">
      <Container className="flex items-center justify-between h-16">
        <h1 className="text-xl font-semibold">HO Studio Management</h1>
        <Button variant="ghost" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </Container>
    </header>
  );
};

export default Header;