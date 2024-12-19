import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserType } from "@/hooks/useUserType";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { ProjectDetailsHeader } from "@/components/projects/ProjectDetailsHeader";
import { ProjectTabs } from "@/components/projects/tabs/ProjectTabs";

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all-consultants");
  const userType = useUserType();
  const isAdmin = useIsAdmin();
  const isClient = userType === 'client';
  const isStaff = userType === 'staff' || isAdmin;

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
          consultant:consultants(
            id,
            name,
            email,
            phone,
            company_name
          )
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
    if (!isStaff) return;
    
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