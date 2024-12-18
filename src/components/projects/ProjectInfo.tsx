interface ProjectInfoProps {
  project: {
    client_name: string;
    client_contact: string;
    client_email: string;
    estimated_cost: number;
    status: string;
    description?: string;
  };
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project Details</h2>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm text-muted-foreground">Client</dt>
          <dd>{project.client_name}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Contact</dt>
          <dd>{project.client_contact}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Email</dt>
          <dd>{project.client_email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Estimated Cost</dt>
          <dd>${project.estimated_cost.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>{project.status}</dd>
        </div>
        {project.description && (
          <div>
            <dt className="text-sm text-muted-foreground">Description</dt>
            <dd>{project.description}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default ProjectInfo;