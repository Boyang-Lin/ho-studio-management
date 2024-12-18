import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, Users, UserCheck } from "lucide-react";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectInfo from "@/components/projects/ProjectInfo";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConsultantGroupsTab from "@/components/projects/ConsultantGroupsTab";
import PaymentManagementTab from "@/components/projects/PaymentManagementTab";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all-consultants");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: projectConsultants = [], isLoading: consultantsLoading } = useQuery({
    queryKey: ["project_consultants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select(`
          *,
          consultant:consultants(*)
        `)
        .eq("project_id", id);

      if (error) throw error;
      return data;
    },
  });

  const { data: consultantGroups = [] } = useQuery({
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

  useEffect(() => {
    const channel = supabase
      .channel('project_consultants_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_consultants',
          filter: `project_id=eq.${id}`
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["project_consultants", id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const handleAssignConsultant = async (consultant: any) => {
    const isAssigned = projectConsultants.some(pc => pc.consultant_id === consultant.id);
    
    try {
      if (isAssigned) {
        const { error } = await supabase
          .from("project_consultants")
          .delete()
          .eq("project_id", id)
          .eq("consultant_id", consultant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Consultant removed successfully",
        });
      } else {
        const { error } = await supabase
          .from("project_consultants")
          .insert({
            project_id: id,
            consultant_id: consultant.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Consultant assigned successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isAssigned ? "Failed to remove consultant" : "Failed to assign consultant",
      });
    }
  };

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
        <div className="space-y-6">
          <ProjectHeader projectName={project.name} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectInfo project={project} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-consultants" className="space-x-2">
              <Users className="h-4 w-4" />
              <span>All Consultants</span>
            </TabsTrigger>
            <TabsTrigger value="engaged-consultants" className="space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Engaged Consultants</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Invoices & Payment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-consultants">
            <ConsultantGroupsTab
              consultantGroups={consultantGroups}
              projectConsultants={projectConsultants}
              onAssignConsultant={handleAssignConsultant}
            />
          </TabsContent>

          <TabsContent value="engaged-consultants">
            <ConsultantGroupsTab
              consultantGroups={consultantGroups}
              projectConsultants={projectConsultants}
              onAssignConsultant={handleAssignConsultant}
              filterAssignedOnly
            />
          </TabsContent>

          <TabsContent value="invoices">
            <PaymentManagementTab
              projectId={id || ''}
              projectConsultants={projectConsultants}
            />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default ProjectDetails;