import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConsultantAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const ConsultantAssignmentDialog = ({
  open,
  onOpenChange,
  projectId,
}: ConsultantAssignmentDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: consultants = [], isLoading } = useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: existingAssignments = [] } = useQuery({
    queryKey: ["project_consultants", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select("consultant_id")
        .eq("project_id", projectId);

      if (error) throw error;
      return data.map(pc => pc.consultant_id);
    },
  });

  const handleAssign = async (consultantId: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("project_consultants")
        .insert({
          project_id: projectId,
          consultant_id: consultantId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultant assigned successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["project_consultants", projectId] });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign consultant",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Consultant</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {consultants
              .filter(c => !existingAssignments.includes(c.id))
              .map((consultant) => (
                <div
                  key={consultant.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{consultant.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {consultant.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAssign(consultant.id)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Assign
                  </Button>
                </div>
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultantAssignmentDialog;