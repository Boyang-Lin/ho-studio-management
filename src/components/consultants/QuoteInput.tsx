import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuoteInputProps {
  projectConsultant?: {
    id: string;
    quote?: number | null;
    quote_status: string;
  };
}

export const QuoteInput = ({ projectConsultant }: QuoteInputProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quote, setQuote] = useState(projectConsultant?.quote?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuote = async () => {
    if (!quote || !projectConsultant) return;

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

  if (projectConsultant?.quote_status === "Approved") {
    return (
      <div>
        <dt className="text-muted-foreground">Quote</dt>
        <dd className="text-xl font-semibold">
          ${projectConsultant.quote?.toLocaleString()}
        </dd>
        <dd className="text-sm text-muted-foreground">
          Status: {projectConsultant.quote_status}
        </dd>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Enter quote"
      />
      <Button
        onClick={handleSubmitQuote}
        disabled={isSubmitting || !quote}
        size="sm"
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Submit
      </Button>
    </div>
  );
};