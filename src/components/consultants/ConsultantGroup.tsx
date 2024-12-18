import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ConsultantCard from "./ConsultantCard";
import { ConsultantGroupActions } from "./ConsultantGroupActions";
import { ConsultantGroupHeader } from "./ConsultantGroupHeader";

interface ConsultantGroupProps {
  group: {
    id: string;
    name: string;
    consultants: Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    }>;
  };
  onEditGroup?: (group: any) => void;
  onDeleteGroup?: (id: string) => void;
  onEditConsultant?: (consultant: any) => void;
  onDeleteConsultant?: (id: string) => void;
  onAssignConsultant?: (consultant: any) => void;
  assignedConsultantIds?: string[];
  variant?: 'default' | 'selection';
  projectConsultants?: Array<{
    id: string;
    consultant_id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      name: string;
    };
  }>;
}

const ConsultantGroup = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onEditConsultant,
  onDeleteConsultant,
  onAssignConsultant,
  assignedConsultantIds = [],
  variant = 'default',
  projectConsultants = [],
}: ConsultantGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="group">
      <CardHeader className="relative">
        <ConsultantGroupActions
          group={group}
          onEditGroup={onEditGroup}
          onDeleteGroup={onDeleteGroup}
          variant={variant}
        />
        <ConsultantGroupHeader
          name={group.name}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.consultants?.map((consultant) => {
              const projectConsultant = projectConsultants.find(
                pc => pc.consultant_id === consultant.id
              );
              
              const transformedProjectConsultant = projectConsultant ? {
                ...projectConsultant,
                consultant: {
                  name: consultant.name
                }
              } : undefined;

              return (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onEdit={onEditConsultant}
                  onDelete={onDeleteConsultant}
                  onAssign={onAssignConsultant}
                  isAssigned={assignedConsultantIds.includes(consultant.id)}
                  variant={variant}
                  projectConsultant={transformedProjectConsultant}
                />
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConsultantGroup;