import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectHeaderProps {
  projectName: string;
  onAssignClick: () => void;
}

const ProjectHeader = ({ projectName, onAssignClick }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{projectName}</h1>
      </div>
      <Button onClick={onAssignClick}>
        <Plus className="h-4 w-4 mr-2" />
        Assign Consultant
      </Button>
    </div>
  );
};

export default ProjectHeader;