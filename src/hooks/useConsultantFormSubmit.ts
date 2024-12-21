import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useConsultantFormSubmit = (onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any, consultant?: { id: string }) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (consultant?.id) {
        // Update existing consultant
        const { error: consultantError } = await supabase
          .from("consultants")
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone,
            company_name: values.company_name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", consultant.id);

        if (consultantError) throw consultantError;

        // Delete existing group membership
        const { error: deleteError } = await supabase
          .from("consultant_group_memberships")
          .delete()
          .eq("consultant_id", consultant.id);

        if (deleteError) throw deleteError;

        // Insert new group membership if a group is selected
        if (values.group_id) {
          const { error: membershipError } = await supabase
            .from("consultant_group_memberships")
            .insert({
              consultant_id: consultant.id,
              group_id: values.group_id,
            });

          if (membershipError) throw membershipError;
        }

        toast({
          title: "Success",
          description: "Consultant updated successfully",
        });
      } else {
        // Create new consultant
        const newConsultantId = crypto.randomUUID();
        const { error: consultantError } = await supabase
          .from("consultants")
          .insert({
            id: newConsultantId,
            name: values.name,
            email: values.email,
            phone: values.phone,
            company_name: values.company_name,
            user_id: user.id,
          });

        if (consultantError) throw consultantError;

        if (values.group_id) {
          const { error: membershipError } = await supabase
            .from("consultant_group_memberships")
            .insert({
              consultant_id: newConsultantId,
              group_id: values.group_id,
            });

          if (membershipError) throw membershipError;
        }

        toast({
          title: "Success",
          description: "Consultant created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["consultant_groups"] });
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};