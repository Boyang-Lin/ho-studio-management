import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: "projects" | "consultants" | "admin";
  setActiveTab: (tab: "projects" | "consultants" | "admin") => void;
  userType: string;
  isAdmin: boolean;
}

const TabNavigation = ({ activeTab, setActiveTab, userType, isAdmin }: TabNavigationProps) => {
  return (
    <div className="flex space-x-4">
      <Button
        variant={activeTab === "projects" ? "default" : "outline"}
        onClick={() => setActiveTab("projects")}
      >
        Projects
      </Button>
      {userType === 'staff' && (
        <Button
          variant={activeTab === "consultants" ? "default" : "outline"}
          onClick={() => setActiveTab("consultants")}
        >
          Consultants
        </Button>
      )}
      {isAdmin && (
        <Button
          variant={activeTab === "admin" ? "default" : "outline"}
          onClick={() => setActiveTab("admin")}
        >
          Admin Dashboard
        </Button>
      )}
    </div>
  );
};

export default TabNavigation;