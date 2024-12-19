import { useState } from "react";
import Container from "@/components/Container";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProjectDialog from "@/components/projects/ProjectDialog";
import ConsultantDialog from "@/components/consultants/ConsultantDialog";
import ConsultantGroupDialog from "@/components/consultants/ConsultantGroupDialog";
import Header from "@/components/layout/Header";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserType } from "@/hooks/useUserType";
import TabNavigation from "@/components/layout/TabNavigation";
import TabContent from "@/components/layout/TabContent";

const Index = () => {
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const userType = useUserType();
  const [activeTab, setActiveTab] = useState<"projects" | "consultants" | "admin">("projects");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [consultantDialogOpen, setConsultantDialogOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // If user is not admin and is staff, only show assigned projects
      if (!isAdmin && userType === 'staff') {
        query = query.eq('assigned_staff_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: consultantGroups = [], refetch: refetchConsultantGroups } = useQuery({
    queryKey: ["consultant_groups"],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from("consultant_groups")
        .select("*, consultants:consultant_group_memberships(consultant:consultants(*))");

      if (groupsError) throw groupsError;

      return groups.map(group => ({
        ...group,
        consultants: group.consultants?.map((membership: any) => membership.consultant) || []
      }));
    },
  });

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

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={handleCloseProjectDialog}
        project={selectedProject}
      />

      <ConsultantDialog
        open={consultantDialogOpen}
        onOpenChange={handleCloseConsultantDialog}
        consultant={selectedConsultant}
        groups={consultantGroups || []}
      />

      <ConsultantGroupDialog
        open={groupDialogOpen}
        onOpenChange={handleCloseGroupDialog}
        group={selectedGroup}
      />
    </div>
  );
};

export default Index;