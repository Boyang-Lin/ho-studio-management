import ProjectConsultantCard from "./ProjectConsultantCard";

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
        <ProjectConsultantCard
          key={pc.id}
          projectConsultant={pc}
        />
      ))}
    </div>
  );
};

export default EngagedConsultantsTab;