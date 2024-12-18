import { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"projects" | "consultants">("projects");

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

  const { data: consultantGroups } = useQuery({
    queryKey: ["consultant_groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultant_groups")
        .select("*, consultants(*)");

      if (error) throw error;
      return data;
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this project? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Client Name</dt>
                        <dd>{project.client_name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Contact</dt>
                        <dd>{project.client_contact}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{project.client_email}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Estimated Cost</dt>
                        <dd>${project.estimated_cost.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Consultants</h2>
              <div className="space-x-2">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Group
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Consultant
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              {consultantGroups?.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {group.consultants?.map((consultant) => (
                        <div
                          key={consultant.id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{consultant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {consultant.email}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Index;