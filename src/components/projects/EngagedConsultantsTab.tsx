import { useParams } from "react-router-dom";
import EngagedConsultantCard from "./EngagedConsultantCard";

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
  const { id: projectId } = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projectConsultants.map((pc) => (
        <EngagedConsultantCard
          key={pc.id}
          projectId={projectId || ''}
          projectConsultant={pc}
        />
      ))}
    </div>
  );
};

export default EngagedConsultantsTab;