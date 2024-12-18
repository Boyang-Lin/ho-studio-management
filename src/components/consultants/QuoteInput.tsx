import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QUOTE_STATUS_OPTIONS = [
  "Pending",
  "Approved",
  "Rejected"
] as const;

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
  const [originalQuote, setOriginalQuote] = useState(projectConsultant?.quote?.toString() || "");
  const [status, setStatus] = useState(projectConsultant?.quote_status || "Pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectConsultant?.quote) {
      setQuote(projectConsultant.quote.toString());
      setOriginalQuote(projectConsultant.quote.toString());
      setStatus(projectConsultant.quote_status);
    }
  }, [projectConsultant?.quote, projectConsultant?.quote_status]);

  const hasQuoteChanged = quote !== originalQuote;

  const handleSubmitQuote = async () => {
    if (!quote || !projectConsultant) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("project_consultants")
        .update({
          quote: parseFloat(quote),
          quote_status: status,
        })
        .eq("id", projectConsultant.id);

      if (error) throw error;

      setOriginalQuote(quote);

      toast({
        title: "Success",
        description: "Quote updated successfully",
      });

      queryClient.invalidateQueries({
        queryKey: ["project_consultants"],
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quote",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Enter quote"
        />
        <Button
          onClick={handleSubmitQuote}
          disabled={isSubmitting || !quote || (!hasQuoteChanged && Boolean(originalQuote))}
          size="sm"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {originalQuote ? "Update" : "Submit"}
        </Button>
      </div>
      <div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {QUOTE_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};