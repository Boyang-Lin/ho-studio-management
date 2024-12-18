import ConsultantGroup from "@/components/consultants/ConsultantGroup";
import EngagedConsultantCardWithDialog from "@/components/consultants/EngagedConsultantCardWithDialog";

interface ConsultantGroupsTabProps {
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
  projectConsultants: Array<{
    id: string;
    consultant_id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    };
  }>;
  onAssignConsultant: (consultant: any) => void;
  variant?: 'default' | 'selection';
  filterAssignedOnly?: boolean;
}

const ConsultantGroupsTab = ({
  consultantGroups,
  projectConsultants,
  onAssignConsultant,
  variant = 'selection',
  filterAssignedOnly = false,
}: ConsultantGroupsTabProps) => {
  const assignedConsultantIds = projectConsultants.map(pc => pc.consultant_id);

  if (filterAssignedOnly) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectConsultants.map((pc) => (
          <EngagedConsultantCardWithDialog
            key={pc.id}
            projectConsultant={pc}
          />
        ))}
      </div>
    );
  }

  const filteredGroups = consultantGroups.map(group => ({
    ...group,
    consultants: group.consultants.filter(consultant => 
      filterAssignedOnly ? assignedConsultantIds.includes(consultant.id) : true
    ),
  })).filter(group => group.consultants.length > 0);

  return (
    <div className="space-y-6">
      {filteredGroups.map((group) => (
        <ConsultantGroup
          key={group.id}
          group={group}
          variant={variant}
          onAssignConsultant={onAssignConsultant}
          assignedConsultantIds={assignedConsultantIds}
          projectConsultants={projectConsultants}
        />
      ))}
    </div>
  );
};

export default ConsultantGroupsTab;