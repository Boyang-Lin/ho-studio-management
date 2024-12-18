import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ConsultantFormFields from "./ConsultantFormFields";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  group_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultantFormProps {
  consultant?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
    group_id?: string;
  };
  groups: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
}

const ConsultantForm = ({ consultant, groups, onClose }: ConsultantFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: consultant?.name || "",
      email: consultant?.email || "",
      phone: consultant?.phone || "",
      company_name: consultant?.company_name || "",
      group_id: consultant?.group_id || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (consultant) {
        const { error } = await supabase
          .from("consultants")
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone,
            company_name: values.company_name,
            group_id: values.group_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", consultant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Consultant updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("consultants")
          .insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
            company_name: values.company_name,
            group_id: values.group_id || null,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Consultant created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["consultants"] });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ConsultantFormFields form={form} groups={groups} />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {consultant ? "Update" : "Create"} Consultant
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsultantForm;