import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, User, Pencil, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConsultantCardProps {
  consultant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
  onEdit?: (consultant: any) => void;
  onDelete?: (id: string) => void;
  onAssign?: (consultant: any) => void;
  isAssigned?: boolean;
  variant?: 'default' | 'selection';
  projectConsultant?: {
    id: string;
    quote?: number | null;
    quote_status: string;
  };
}

const ConsultantCard = ({ 
  consultant, 
  onEdit, 
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default',
  projectConsultant,
}: ConsultantCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quote, setQuote] = useState(projectConsultant?.quote?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSelectionVariant = variant === 'selection';

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

  const handleApproveQuote = async () => {
    if (!projectConsultant) return;

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
    <Card className="bg-white">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          {isSelectionVariant ? (
            <Checkbox
              checked={isAssigned}
              onCheckedChange={() => onAssign?.(consultant)}
              aria-label={isAssigned ? "Remove consultant" : "Assign consultant"}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(consultant)}
              >
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
                    <AlertDialogTitle>Delete Consultant</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this consultant? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete?.(consultant.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">{consultant.name}</CardTitle>
            {consultant.company_name && (
              <p className="text-sm text-muted-foreground">
                {consultant.company_name}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{consultant.email}</dd>
          </div>
          {consultant.phone && (
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{consultant.phone}</dd>
            </div>
          )}
          {projectConsultant && (
            <div className="mt-4 pt-4 border-t">
              {projectConsultant.quote_status === "Approved" ? (
                <div>
                  <dt className="text-muted-foreground">Quote</dt>
                  <dd className="text-xl font-semibold">
                    ${projectConsultant.quote?.toLocaleString()}
                  </dd>
                  <dd className="text-sm text-muted-foreground">
                    Status: {projectConsultant.quote_status}
                  </dd>
                </div>
              ) : (
                <div className="space-y-2">
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
                      Submit
                    </Button>
                  </div>
                  {projectConsultant.quote && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Quote</p>
                        <p className="text-lg">
                          ${projectConsultant.quote.toLocaleString()}
                        </p>
                      </div>
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
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default ConsultantCard;