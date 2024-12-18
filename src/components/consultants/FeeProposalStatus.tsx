import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  "Fee Proposal Received",
  "Fee Proposal Sent",
  "Fee Proposal Signed",
] as const;

interface FeeProposalStatusProps {
  projectConsultant: {
    id: string;
    fee_proposal_status?: string;
  };
}

export const FeeProposalStatus = ({ projectConsultant }: FeeProposalStatusProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("project_consultants")
        .update({ fee_proposal_status: status })
        .eq("id", projectConsultant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Status updated successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_consultants"],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Fee Proposal Status</label>
      <Select
        value={projectConsultant.fee_proposal_status || STATUS_OPTIONS[0]}
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};