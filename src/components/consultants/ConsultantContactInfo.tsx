import { User, Building2, Mail, Phone } from "lucide-react";

interface ConsultantContactInfoProps {
  consultant: {
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
}

export const ConsultantContactInfo = ({ consultant }: ConsultantContactInfoProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="text-lg font-semibold">{consultant.name}</span>
      </div>
      {consultant.company_name && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{consultant.company_name}</span>
        </div>
      )}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span>{consultant.email}</span>
      </div>
      {consultant.phone && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{consultant.phone}</span>
        </div>
      )}
    </>
  );
};