import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "./TaskFormFields";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

type FormData = z.infer<typeof taskFormSchema>;

interface UseTaskFormProps {
  projectConsultantId: string;
  task?: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    status: string;
  };
  onSuccess: () => void;
}

export const useTaskForm = ({ projectConsultantId, task, onSuccess }: UseTaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      due_date: task?.due_date ? task.due_date.split('T')[0] : "",
      status: (task?.status as "Pending Input" | "In Progress" | "Completed") || "Pending Input",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      if (task) {
        const { error } = await supabase
          .from("consultant_tasks")
          .update({
            title: values.title,
            description: values.description,
            due_date: values.due_date ? `${values.due_date}T00:00:00` : null,
            status: values.status,
          })
          .eq('id', task.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("consultant_tasks")
          .insert({
            project_consultant_id: projectConsultantId,
            title: values.title,
            description: values.description,
            due_date: values.due_date ? `${values.due_date}T00:00:00` : null,
            status: values.status,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["consultant_tasks"] });
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: task ? "Failed to update task" : "Failed to create task",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};