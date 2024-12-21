import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConsultantContactInfo } from "@/components/consultants/ConsultantContactInfo";
import { Badge } from "@/components/ui/badge";

const ConsultantDetails = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();

  const { data: consultant } = useQuery({
    queryKey: ["consultant", consultantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .eq("id", consultantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: engagedProjects = [] } = useQuery({
    queryKey: ["consultant_projects", consultantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select(`
          *,
          project:projects(*)
        `)
        .eq("consultant_id", consultantId);

      if (error) throw error;
      return data;
    },
  });

  if (!consultant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Consultant Details</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <ConsultantContactInfo consultant={consultant} />
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Engaged Projects</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {engagedProjects.map((engagement) => (
                <Card 
                  key={engagement.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/project/${engagement.project.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{engagement.project.name}</h3>
                        <Badge>{engagement.project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Client: {engagement.project.client_name}
                      </p>
                      {engagement.quote && (
                        <p className="text-sm">
                          Quote: ${engagement.quote.toLocaleString()}
                        </p>
                      )}
                      <Badge 
                        variant="outline" 
                        className="mt-2"
                      >
                        {engagement.quote_status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {engagedProjects.length === 0 && (
                <p className="text-muted-foreground col-span-full">
                  No projects found for this consultant.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ConsultantDetails;