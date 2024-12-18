import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import TaskDialog from "./TaskDialog";

interface ProjectConsultantCardProps {
  projectConsultant: {
    id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    };
  };
}

const ProjectConsultantCard = ({
  projectConsultant,
}: ProjectConsultantCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quote, setQuote] = useState(projectConsultant.quote?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleSubmitQuote = async () => {
    if (!quote) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("project_consultants")
        .update({
          quote: parseFloat(quote),
          quote_status: "Pending",
        })
        .eq("id", projectConsultant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote submitted successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_consultants"],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quote",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveQuote = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("project_consultants")
        .update({
          quote_status: "Approved",
        })
        .eq("id", projectConsultant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote approved successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_consultants"],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve quote",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            {projectConsultant.consultant.name}
          </CardTitle>
          {projectConsultant.quote_status === "Approved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTaskDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm">
              <p className="text-muted-foreground">
                {projectConsultant.consultant.email}
              </p>
              {projectConsultant.consultant.company_name && (
                <p className="text-muted-foreground">
                  {projectConsultant.consultant.company_name}
                </p>
              )}
            </div>

            {projectConsultant.quote_status === "Approved" ? (
              <div>
                <p className="text-sm font-medium">Quote</p>
                <p className="text-2xl font-bold">
                  ${projectConsultant.quote?.toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Enter quote amount"
                  />
                </div>
                <Button
                  onClick={handleSubmitQuote}
                  disabled={isSubmitting || !quote}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Quote
                </Button>
                {projectConsultant.quote && (
                  <Button
                    variant="secondary"
                    onClick={handleApproveQuote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        projectConsultantId={projectConsultant.id}
      />
    </>
  );
};

export default ProjectConsultantCard;