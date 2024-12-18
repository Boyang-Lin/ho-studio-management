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
  name: z.string().min(1, "Group name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultantGroupFormProps {
  group?: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

const ConsultantGroupForm = ({ group, onClose }: ConsultantGroupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group?.name || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (group) {
        // Update existing group
        const { error } = await supabase
          .from("consultant_groups")
          .update({
            name: values.name,
          })
          .eq("id", group.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Group updated successfully",
        });
      } else {
        // Create new group
        const { error } = await supabase
          .from("consultant_groups")
          .insert({
            name: values.name,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Group created successfully",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
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
            {group ? "Update" : "Create"} Group
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsultantGroupForm;