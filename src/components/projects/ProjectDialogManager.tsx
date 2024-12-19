import { useState } from "react";
import ProjectDialog from "./ProjectDialog";
import { Project } from "@/types/project";

interface ProjectDialogManagerProps {
  onClose: () => void;
  isOpen: boolean;
  selectedProject: Project | null;
}

const ProjectDialogManager = ({ onClose, isOpen, selectedProject }: ProjectDialogManagerProps) => {
  return (
    <ProjectDialog
      open={isOpen}
      onOpenChange={onClose}
      project={selectedProject}
    />
  );
};

export default ProjectDialogManager;