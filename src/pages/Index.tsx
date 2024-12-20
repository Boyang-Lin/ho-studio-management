import { useState } from "react";
import Container from "@/components/Container";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserType } from "@/hooks/useUserType";
import TabNavigation from "@/components/layout/TabNavigation";
import TabContent from "@/components/layout/TabContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ProjectDialogs from "@/components/projects/ProjectDialogs";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { useConsultantGroups } from "@/hooks/useConsultantGroups";

const Index = () => {
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const userType = useUserType();
  const [activeTab, setActiveTab] = useState<"projects" | "consultants" | "admin">("projects");
  
  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [consultantDialogOpen, setConsultantDialogOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const { data: projects = [], refetch: refetchProjects } = useProjectsQuery();
  const { data: consultantGroups = [], refetch: refetchConsultantGroups } = useConsultantGroups();

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
    refetchProjects();
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleCloseProjectDialog = () => {
    setSelectedProject(null);
    setProjectDialogOpen(false);
  };

  const handleDeleteConsultant = async (id: string) => {
    const { error } = await supabase.from("consultants").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete consultant",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Consultant deleted successfully",
    });
    refetchConsultantGroups();
  };

  const handleEditConsultant = (consultant: any) => {
    setSelectedConsultant(consultant);
    setConsultantDialogOpen(true);
  };

  const handleCloseConsultantDialog = () => {
    setSelectedConsultant(null);
    setConsultantDialogOpen(false);
  };

  const handleDeleteGroup = async (id: string) => {
    const { error } = await supabase.from("consultant_groups").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete group",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Group deleted successfully",
    });
    refetchConsultantGroups();
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    setGroupDialogOpen(true);
  };

  const handleCloseGroupDialog = () => {
    setSelectedGroup(null);
    setGroupDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <Container className="py-8 space-y-8">
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userType={userType}
          isAdmin={isAdmin}
        />

        <TabContent
          activeTab={activeTab}
          projects={projects}
          consultantGroups={consultantGroups}
          userType={userType}
          isAdmin={isAdmin}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={() => setProjectDialogOpen(true)}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          onEditConsultant={handleEditConsultant}
          onDeleteConsultant={handleDeleteConsultant}
          onNewGroup={() => setGroupDialogOpen(true)}
          onNewConsultant={() => setConsultantDialogOpen(true)}
        />
      </Container>

      <ProjectDialogs
        projectDialogOpen={projectDialogOpen}
        onCloseProjectDialog={handleCloseProjectDialog}
        selectedProject={selectedProject}
        consultantDialogOpen={consultantDialogOpen}
        onCloseConsultantDialog={handleCloseConsultantDialog}
        selectedConsultant={selectedConsultant}
        groupDialogOpen={groupDialogOpen}
        onCloseGroupDialog={handleCloseGroupDialog}
        selectedGroup={selectedGroup}
        consultantGroups={consultantGroups}
      />
    </div>
  );
};

export default Index;