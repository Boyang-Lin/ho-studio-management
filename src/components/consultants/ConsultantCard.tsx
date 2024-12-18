import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConsultantInfo } from "./ConsultantInfo";
import { ConsultantCardActions } from "./ConsultantCardActions";

interface ConsultantCardProps {
  consultant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
  onEdit?: (consultant: any) => void;
  onDelete?: (id: string) => void;
  onAssign?: (consultant: any) => void;
  isAssigned?: boolean;
  variant?: 'default' | 'selection';
  projectConsultant?: {
    id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      name: string;
    };
  };
}

const ConsultantCard = ({ 
  consultant, 
  onEdit, 
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default',
  projectConsultant,
}: ConsultantCardProps) => {
  return (
    <Card className="bg-white group">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4">
          <ConsultantCardActions
            consultantId={consultant.id}
            onEdit={() => onEdit?.(consultant)}
            onDelete={onDelete}
            onAssign={() => onAssign?.(consultant)}
            isAssigned={isAssigned}
            variant={variant}
          />
        </div>
        <ConsultantInfo consultant={consultant} />
      </CardHeader>
    </Card>
  );
};

export default ConsultantCard;