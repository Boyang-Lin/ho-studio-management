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
import { Project, ProjectFormValues } from "@/types/project";
import ProjectFormFields from "./ProjectFormFields";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  client_name: z.string().min(1, "Client name is required"),
  client_contact: z.string().min(1, "Contact number is required"),
  client_email: z.string().email("Invalid email address"),
  estimated_cost: z.number({
    required_error: "Estimated cost is required",
    invalid_type_error: "Estimated cost must be a number",
  }).nonnegative("Cost must be a positive number"),
  status: z.string(),
});

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      client_name: project?.client_name || "",
      client_contact: project?.client_contact || "",
      client_email: project?.client_email || "",
      estimated_cost: project?.estimated_cost || 0,
      status: project?.status || "Design Stage",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (project) {
        const { error } = await supabase
          .from("projects")
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { error } = await supabase
          .from("projects")
          .insert({
            ...values,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
        <ProjectFormFields control={form.control} />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Update" : "Create"} Project
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;