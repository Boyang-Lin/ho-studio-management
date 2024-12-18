import { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProjectDialog from "@/components/projects/ProjectDialog";
import ConsultantDialog from "@/components/consultants/ConsultantDialog";
import ConsultantGroupDialog from "@/components/consultants/ConsultantGroupDialog";
import ProjectCard from "@/components/projects/ProjectCard";
import ConsultantGroup from "@/components/consultants/ConsultantGroup";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"projects" | "consultants">("projects");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [consultantDialogOpen, setConsultantDialogOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const { data: projects, refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: consultantGroups, refetch: refetchConsultantGroups } = useQuery({
    queryKey: ["consultant_groups"],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from("consultant_groups")
        .select("*, consultants:consultant_group_memberships(consultant:consultants(*))");

      if (groupsError) throw groupsError;

      return groups.map(group => ({
        ...group,
        consultants: group.consultants.map((membership: any) => membership.consultant)
      }));
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <Container className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold">Project Management</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </Container>
      </header>

      <Container className="py-8">
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "projects" ? "default" : "outline"}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </Button>
          <Button
            variant={activeTab === "consultants" ? "default" : "outline"}
            onClick={() => setActiveTab("consultants")}
          >
            Consultants
          </Button>
        </div>

        {activeTab === "projects" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Projects</h2>
              <Button onClick={() => setProjectDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Consultants</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setGroupDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Group
                </Button>
                <Button onClick={() => setConsultantDialogOpen(true)}>
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
                  onEditGroup={handleEditGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onEditConsultant={handleEditConsultant}
                  onDeleteConsultant={handleDeleteConsultant}
                />
              ))}
            </div>
          </div>
        )}
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
