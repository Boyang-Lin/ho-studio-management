import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserType } from "@/hooks/useUserType";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Container from "@/components/Container";
import { ProjectDetailsHeader } from "@/components/projects/ProjectDetailsHeader";
import { ProjectTabs } from "@/components/projects/tabs/ProjectTabs";
import { useProjectData } from "@/hooks/useProjectData";
import { useProjectConsultants } from "@/hooks/useProjectConsultants";
import { useConsultantGroups } from "@/hooks/useConsultantGroups";
import { useState } from "react";

const ProjectDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("all-consultants");
  const userType = useUserType();
  const isAdmin = useIsAdmin();
  const isClient = userType === 'client';
  const isStaff = userType === 'staff' || isAdmin;

  const { data: project, isLoading: projectLoading } = useProjectData(id);
  const { data: projectConsultants = [], handleAssignConsultant, isLoading: consultantsLoading } = useProjectConsultants(id);
  const { data: consultantGroups = [] } = useConsultantGroups();

  if (projectLoading || consultantsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8 space-y-8">
        <ProjectDetailsHeader project={project} />
        
        <ProjectTabs
          projectId={id || ''}
          consultantGroups={consultantGroups}
          projectConsultants={projectConsultants}
          onAssignConsultant={handleAssignConsultant}
          isStaff={isStaff}
          isClient={isClient}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Container>
    </div>
  );
};

export default ProjectDetails;