import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from "react-hook-form";

const PROJECT_STATUSES = [
  "Design Stage",
  "Coordination Stage",
  "Submitted",
  "Approved",
  "On hold",
  "Canceled",
] as const;

export type ProjectStatus = typeof PROJECT_STATUSES[number];

interface ProjectStatusSelectProps {
  control: Control<any>;
}

const ProjectStatusSelect = ({ control }: ProjectStatusSelectProps) => {
  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Status</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ProjectStatusSelect;