import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConsultantForm from "./ConsultantForm";

interface ConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
  groups: {
    id: string;
    name: string;
  }[];
}

const ConsultantDialog = ({ 
  open, 
  onOpenChange, 
  consultant, 
  groups = [] // Provide default empty array
}: ConsultantDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{consultant ? "Edit" : "Create"} Consultant</DialogTitle>
        </DialogHeader>
        <ConsultantForm
          consultant={consultant}
          groups={groups}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConsultantDialog;