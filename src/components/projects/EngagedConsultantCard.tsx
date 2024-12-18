import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface EngagedConsultantCardProps {
  projectId: string;
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
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending Approval":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Fee Proposal Received":
    default:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  }
};

const EngagedConsultantCard = ({
  projectId,
  projectConsultant,
}: EngagedConsultantCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/project/${projectId}/consultant/${projectConsultant.consultant.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {projectConsultant.consultant.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {projectConsultant.consultant.email}
        </p>
        {projectConsultant.consultant.company_name && (
          <p className="text-sm text-muted-foreground">
            {projectConsultant.consultant.company_name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {projectConsultant.quote && (
          <div className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Quote Amount</dt>
              <dd className="text-2xl font-bold">
                ${projectConsultant.quote.toLocaleString()}
              </dd>
            </div>
            <Badge className={`${getStatusColor(projectConsultant.quote_status)} font-medium`}>
              {projectConsultant.quote_status}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagedConsultantCard;