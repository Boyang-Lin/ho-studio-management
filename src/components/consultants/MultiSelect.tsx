import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect = ({ 
  options = [], 
  selected = [], 
  onChange 
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  // Ensure we have valid arrays to work with
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = Array.isArray(selected) ? selected : [];

  // Create a map for faster lookups
  const optionsMap = new Map(safeOptions.map(opt => [opt.value, opt]));

  const selectedLabels = safeSelected
    .map(value => optionsMap.get(value)?.label)
    .filter(Boolean);

  const toggleOption = (value: string) => {
    if (!value) return;
    const newSelected = safeSelected.includes(value)
      ? safeSelected.filter((item) => item !== value)
      : [...safeSelected, value];
    onChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          ) : (
            "Select groups..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search groups..." />
          <CommandEmpty>No groups found.</CommandEmpty>
          <CommandGroup>
            {safeOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => toggleOption(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    safeSelected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};