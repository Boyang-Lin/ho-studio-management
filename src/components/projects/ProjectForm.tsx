import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  client_name: z.string().min(1, "Client name is required"),
  client_contact: z.string().min(1, "Contact number is required"),
  client_email: z.string().email("Invalid email address"),
  estimated_cost: z.number({
    required_error: "Estimated cost is required",
    invalid_type_error: "Estimated cost must be a number",
  }).nonnegative("Cost must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
  };
  onClose: () => void;
}

const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      client_name: project?.client_name || "",
      client_contact: project?.client_contact || "",
      client_email: project?.client_email || "",
      estimated_cost: project?.estimated_cost || 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (project) {
        // Update existing project
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
        // Create new project
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        // Ensure all required fields are present and properly typed
        const projectData = {
          name: values.name,
          client_name: values.client_name,
          client_contact: values.client_contact,
          client_email: values.client_email,
          estimated_cost: values.estimated_cost,
          user_id: user.id,
        };

        const { error } = await supabase
          .from("projects")
          .insert(projectData);

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimated_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Cost</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter estimated cost"
                  type="number"
                  step="0.01"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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