import ConsultantGroup from "@/components/consultants/ConsultantGroup";
import EngagedConsultantCardWithDialog from "@/components/consultants/EngagedConsultantCardWithDialog";
import { TaskSummaryCard } from "@/components/consultants/task/TaskSummaryCard";

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
    const consultantsByGroup = new Map();
    
    consultantGroups.forEach(group => {
      consultantsByGroup.set(group.id, {
        ...group,
        consultants: [],
      });
    });

    projectConsultants.forEach(pc => {
      const consultant = pc.consultant;
      const group = consultantGroups.find(g => 
        g.consultants.some(c => c.id === consultant.id)
      );
      
      if (group) {
        const groupData = consultantsByGroup.get(group.id);
        if (groupData) {
          groupData.consultants.push({
            ...consultant,
            projectConsultant: pc,
          });
        }
      }
    });

    const populatedGroups = Array.from(consultantsByGroup.values())
      .filter(group => group.consultants.length > 0);

    return (
      <div className="space-y-6">
        {populatedGroups.map(group => (
          <div key={group.id} className="space-y-4">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <div className="grid grid-cols-1 gap-4">
              {group.consultants.map((consultant: any) => (
                <div key={consultant.projectConsultant.id} className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <EngagedConsultantCardWithDialog
                      projectConsultant={consultant.projectConsultant}
                    />
                  </div>
                  <div className="col-span-2">
                    <TaskSummaryCard
                      projectConsultantId={consultant.projectConsultant.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {consultantGroups.map((group) => (
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