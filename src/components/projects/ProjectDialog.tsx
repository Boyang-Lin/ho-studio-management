import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    id: string;
    name: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
    status: string;
  };
}

const ProjectDialog = ({ open, onOpenChange, project }: ProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit" : "Create"} Project</DialogTitle>
        </DialogHeader>
        <ProjectForm project={project} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;