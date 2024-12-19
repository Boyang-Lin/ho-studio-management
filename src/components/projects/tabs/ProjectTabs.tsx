import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Users, UserCheck } from "lucide-react";
import ConsultantGroupsTab from "../ConsultantGroupsTab";
import PaymentManagementTab from "../PaymentManagementTab";

interface ProjectTabsProps {
  projectId: string;
  consultantGroups: any[];
  projectConsultants: any[];
  onAssignConsultant: (consultant: any) => void;
  isStaff: boolean;
  isClient: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ProjectTabs = ({
  projectId,
  consultantGroups,
  projectConsultants,
  onAssignConsultant,
  isStaff,
  isClient,
  activeTab,
  setActiveTab,
}: ProjectTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="all-consultants" className="space-x-2">
          <Users className="h-4 w-4" />
          <span>All Consultants</span>
        </TabsTrigger>
        <TabsTrigger value="engaged-consultants" className="space-x-2">
          <UserCheck className="h-4 w-4" />
          <span>Engaged Consultants</span>
        </TabsTrigger>
        <TabsTrigger value="payment-management" className="space-x-2">
          <CreditCard className="h-4 w-4" />
          <span>Payment Management</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-consultants">
        <ConsultantGroupsTab
          consultantGroups={consultantGroups}
          projectConsultants={projectConsultants}
          onAssignConsultant={onAssignConsultant}
          variant="selection"
          readOnly={!isStaff}
        />
      </TabsContent>

      <TabsContent value="engaged-consultants">
        <ConsultantGroupsTab
          consultantGroups={consultantGroups}
          projectConsultants={projectConsultants}
          onAssignConsultant={onAssignConsultant}
          filterAssignedOnly
          readOnly={!isStaff}
        />
      </TabsContent>

      <TabsContent value="payment-management">
        <PaymentManagementTab
          projectId={projectId}
          projectConsultants={projectConsultants}
          readOnly={isClient}
        />
      </TabsContent>
    </Tabs>
  );
};