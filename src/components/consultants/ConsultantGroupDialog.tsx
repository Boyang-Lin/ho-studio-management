import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConsultantGroupForm from "./ConsultantGroupForm";

interface ConsultantGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: {
    id: string;
    name: string;
  };
}

const ConsultantGroupDialog = ({
  open,
  onOpenChange,
  group,
}: ConsultantGroupDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group ? "Edit" : "Create"} Group</DialogTitle>
        </DialogHeader>
        <ConsultantGroupForm
          group={group}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConsultantGroupDialog;