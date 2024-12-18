import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ConsultantGroup from "./ConsultantGroup";

interface ConsultantListProps {
  consultantGroups: Array<{
    id: string;
    name: string;
    consultants: Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    }>;
  }>;
  onEditGroup: (group: any) => void;
  onDeleteGroup: (id: string) => void;
  onEditConsultant: (consultant: any) => void;
  onDeleteConsultant: (id: string) => void;
  onNewGroup: () => void;
  onNewConsultant: () => void;
}

const ConsultantList = ({
  consultantGroups,
  onEditGroup,
  onDeleteGroup,
  onEditConsultant,
  onDeleteConsultant,
  onNewGroup,
  onNewConsultant,
}: ConsultantListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consultants</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onNewGroup}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
          <Button onClick={onNewConsultant}>
            <Plus className="h-4 w-4 mr-2" />
            New Consultant
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {consultantGroups?.map((group) => (
          <ConsultantGroup
            key={group.id}
            group={group}
            onEditGroup={onEditGroup}
            onDeleteGroup={onDeleteGroup}
            onEditConsultant={onEditConsultant}
            onDeleteConsultant={onDeleteConsultant}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsultantList;