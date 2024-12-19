import { useState } from "react";
import ProjectDialogManager from "./ProjectDialogManager";
import ConsultantDialogManager from "../consultants/ConsultantDialogManager";

interface ProjectDialogsProps {
  projectDialogOpen: boolean;
  onCloseProjectDialog: () => void;
  selectedProject: any;
  consultantDialogOpen: boolean;
  onCloseConsultantDialog: () => void;
  selectedConsultant: any;
  groupDialogOpen: boolean;
  onCloseGroupDialog: () => void;
  selectedGroup: any;
  consultantGroups: any[];
}

const ProjectDialogs = ({
  projectDialogOpen,
  onCloseProjectDialog,
  selectedProject,
  consultantDialogOpen,
  onCloseConsultantDialog,
  selectedConsultant,
  groupDialogOpen,
  onCloseGroupDialog,
  selectedGroup,
  consultantGroups,
}: ProjectDialogsProps) => {
  return (
    <>
      <ProjectDialogManager
        isOpen={projectDialogOpen}
        onClose={onCloseProjectDialog}
        selectedProject={selectedProject}
      />

      <ConsultantDialogManager
        consultantDialogOpen={consultantDialogOpen}
        onCloseConsultant={onCloseConsultantDialog}
        selectedConsultant={selectedConsultant}
        groupDialogOpen={groupDialogOpen}
        onCloseGroup={onCloseGroupDialog}
        selectedGroup={selectedGroup}
        consultantGroups={consultantGroups}
      />
    </>
  );
};

export default ProjectDialogs;