import ProjectList from "@/components/projects/ProjectList";
import ConsultantList from "@/components/consultants/ConsultantList";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Project } from "@/types/project";

interface TabContentProps {
  activeTab: "projects" | "consultants" | "admin";
  projects: Project[];
  consultantGroups: any[];
  userType: string;
  isAdmin: boolean;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onEditGroup: (group: any) => void;
  onDeleteGroup: (id: string) => void;
  onEditConsultant: (consultant: any) => void;
  onDeleteConsultant: (id: string) => void;
  onNewGroup: () => void;
  onNewConsultant: () => void;
}

const TabContent = ({
  activeTab,
  projects,
  consultantGroups,
  userType,
  isAdmin,
  onEditProject,
  onDeleteProject,
  onNewProject,
  onEditGroup,
  onDeleteGroup,
  onEditConsultant,
  onDeleteConsultant,
  onNewGroup,
  onNewConsultant,
}: TabContentProps) => {
  if (activeTab === "projects") {
    return (
      <ProjectList
        projects={projects}
        onEdit={onEditProject}
        onDelete={onDeleteProject}
        onNew={onNewProject}
      />
    );
  }

  if (activeTab === "consultants" && userType === 'staff') {
    return (
      <ConsultantList
        consultantGroups={consultantGroups}
        onEditGroup={onEditGroup}
        onDeleteGroup={onDeleteGroup}
        onEditConsultant={onEditConsultant}
        onDeleteConsultant={onDeleteConsultant}
        onNewGroup={onNewGroup}
        onNewConsultant={onNewConsultant}
      />
    );
  }

  if (activeTab === "admin" && isAdmin) {
    return <AdminDashboard />;
  }

  return null;
};

export default TabContent;