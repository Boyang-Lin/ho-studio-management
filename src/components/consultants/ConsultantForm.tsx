import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import ConsultantFormFields from "./ConsultantFormFields";
import { useConsultantGroup } from "@/hooks/useConsultantGroup";
import { useConsultantFormSubmit } from "@/hooks/useConsultantFormSubmit";

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
  const { getCurrentGroupId } = useConsultantGroup(consultant?.id);
  const { handleSubmit: submitForm, isSubmitting } = useConsultantFormSubmit(onClose);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (consultant?.id) {
        const currentGroupId = await getCurrentGroupId();
        return {
          name: consultant.name,
          email: consultant.email,
          phone: consultant.phone || "",
          company_name: consultant.company_name || "",
          group_id: currentGroupId,
        };
      }
      return {
        name: "",
        email: "",
        phone: "",
        company_name: "",
        group_id: "",
      };
    },
  });

  const onSubmit = async (values: FormValues) => {
    await submitForm(values, consultant);
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