import ConsultantDialog from "./ConsultantDialog";
import ConsultantGroupDialog from "./ConsultantGroupDialog";

interface ConsultantDialogManagerProps {
  consultantDialogOpen: boolean;
  onCloseConsultant: () => void;
  selectedConsultant: any;
  groupDialogOpen: boolean;
  onCloseGroup: () => void;
  selectedGroup: any;
  consultantGroups: any[];
}

const ConsultantDialogManager = ({
  consultantDialogOpen,
  onCloseConsultant,
  selectedConsultant,
  groupDialogOpen,
  onCloseGroup,
  selectedGroup,
  consultantGroups,
}: ConsultantDialogManagerProps) => {
  return (
    <>
      <ConsultantDialog
        open={consultantDialogOpen}
        onOpenChange={onCloseConsultant}
        consultant={selectedConsultant}
        groups={consultantGroups}
      />

      <ConsultantGroupDialog
        open={groupDialogOpen}
        onOpenChange={onCloseGroup}
        group={selectedGroup}
      />
    </>
  );
};

export default ConsultantDialogManager;