import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ConsultantGroupHeaderProps {
  name: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ConsultantGroupHeader = ({
  name,
  isExpanded,
  onToggleExpand,
}: ConsultantGroupHeaderProps) => {
  return (
    <div className="flex items-center justify-between pr-24">
      <CardTitle>{name}</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpand}
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};