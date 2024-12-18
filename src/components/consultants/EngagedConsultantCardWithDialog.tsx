import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConsultantPaymentInfo } from "./ConsultantPaymentInfo";
import { User, Building2, Mail } from "lucide-react";

interface EngagedConsultantCardWithDialogProps {
  projectConsultant: {
    id: string;
    quote?: number | null;
    quote_status: string;
    consultant: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      company_name?: string;
    };
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Fee Proposal Signed":
      return "bg-green-100 text-green-800";
    case "Pending Approval":
      return "bg-yellow-100 text-yellow-800";
    case "Fee Proposal Received":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const EngagedConsultantCardWithDialog = ({
  projectConsultant,
}: EngagedConsultantCardWithDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow bg-white"
        onClick={() => setDialogOpen(true)}
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{projectConsultant.consultant.name}</CardTitle>
          </div>
          {projectConsultant.consultant.company_name && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{projectConsultant.consultant.company_name}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{projectConsultant.consultant.email}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectConsultant.quote && (
              <div>
                <p className="text-sm text-muted-foreground">Quote Amount</p>
                <p className="text-2xl font-bold">
                  ${projectConsultant.quote.toLocaleString()}
                </p>
              </div>
            )}
            <Badge className={`${getStatusColor(projectConsultant.quote_status)}`}>
              {projectConsultant.quote_status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{projectConsultant.consultant.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <ConsultantPaymentInfo projectConsultant={projectConsultant} />
            {/* Tasks section can be added here */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EngagedConsultantCardWithDialog;