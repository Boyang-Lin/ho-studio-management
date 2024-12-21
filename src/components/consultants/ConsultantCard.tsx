import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConsultantInfo } from "./ConsultantInfo";
import { ConsultantCardActions } from "./ConsultantCardActions";
import { QuoteInput } from "./QuoteInput";
import { useNavigate, useLocation } from "react-router-dom";

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
  readOnly?: boolean;
}

const ConsultantCard = ({ 
  consultant, 
  onEdit, 
  onDelete,
  onAssign,
  isAssigned = false,
  variant = 'default',
  projectConsultant,
  readOnly = false,
}: ConsultantCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === '/';

  const handleClick = () => {
    if (isIndexPage) {
      navigate(`/consultant/${consultant.id}`);
    }
  };

  return (
    <Card 
      className={`bg-white group ${isIndexPage ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={handleClick}
    >
      <CardHeader className="relative">
        {!readOnly && (
          <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
            <ConsultantCardActions
              consultantId={consultant.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssign={onAssign}
              isAssigned={isAssigned}
              variant={variant}
              consultant={consultant}
            />
          </div>
        )}
        <ConsultantInfo consultant={consultant} />
      </CardHeader>
      {isAssigned && variant === 'selection' && !readOnly && (
        <CardContent onClick={(e) => e.stopPropagation()}>
          <QuoteInput projectConsultant={projectConsultant} />
        </CardContent>
      )}
    </Card>
  );
};

export default ConsultantCard;