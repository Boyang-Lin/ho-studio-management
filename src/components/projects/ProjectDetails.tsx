import { CardTitle } from "@/components/ui/card";

interface ProjectDetailsProps {
  project: {
    name: string;
    description?: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
  };
}

export const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  return (
    <>
      <CardTitle>{project.name}</CardTitle>
      {project.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {project.description}
        </p>
      )}
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Client Name</dt>
          <dd>{project.client_name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Contact</dt>
          <dd>{project.client_contact}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{project.client_email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Estimated Cost</dt>
          <dd>${project.estimated_cost.toLocaleString()}</dd>
        </div>
      </dl>
    </>
  );
};