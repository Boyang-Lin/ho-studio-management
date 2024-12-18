import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <div>
                <dt className="text-muted-foreground">Quote</dt>
                <dd className="text-xl font-semibold">
                  ${pc.quote.toLocaleString()}
                </dd>
                <dd className="text-sm text-muted-foreground">
                  Status: {pc.quote_status}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EngagedConsultantsTab;