import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "./MultiSelect";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  group_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultantFormFieldsProps {
  form: UseFormReturn<FormValues>;
  groups: {
    id: string;
    name: string;
  }[];
}

const ConsultantFormFields = ({ form, groups }: ConsultantFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter consultant name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
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
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="group_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Groups (Optional)</FormLabel>
            <MultiSelect
              options={groups.map(group => ({
                value: group.id,
                label: group.name
              }))}
              selected={field.value || []}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ConsultantFormFields;