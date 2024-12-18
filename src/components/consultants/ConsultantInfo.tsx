import { User } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface ConsultantInfoProps {
  consultant: {
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
}

export const ConsultantInfo = ({ consultant }: ConsultantInfoProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle className="text-lg">{consultant.name}</CardTitle>
          {consultant.company_name && (
            <p className="text-sm text-muted-foreground">
              {consultant.company_name}
            </p>
          )}
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{consultant.email}</dd>
        </div>
        {consultant.phone && (
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{consultant.phone}</dd>
          </div>
        )}
      </dl>
    </>
  );
};