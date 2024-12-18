import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EngagedConsultantsTabProps {
  projectConsultants: Array<{
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
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Fee Proposal Signed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending Approval":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Fee Proposal Received":
    default:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  }
};

const EngagedConsultantsTab = ({
  projectConsultants,
}: EngagedConsultantsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projectConsultants.map((pc) => (
        <Card key={pc.id}>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {pc.consultant.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {pc.consultant.email}
            </p>
            {pc.consultant.company_name && (
              <p className="text-sm text-muted-foreground">
                {pc.consultant.company_name}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {pc.quote && (
              <div className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Quote Amount</dt>
                  <dd className="text-2xl font-bold">
                    ${pc.quote.toLocaleString()}
                  </dd>
                </div>
                <Badge className={`${getStatusColor(pc.quote_status)} font-medium`}>
                  {pc.quote_status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EngagedConsultantsTab;