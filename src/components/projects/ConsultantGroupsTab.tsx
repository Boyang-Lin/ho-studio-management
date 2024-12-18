import ConsultantGroup from "@/components/consultants/ConsultantGroup";

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