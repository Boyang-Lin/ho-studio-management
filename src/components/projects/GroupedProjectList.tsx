import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";
import { useUserType } from "@/hooks/useUserType";

interface GroupedProjectListProps {
  projects: Array<Project>;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const GroupedProjectList = ({ projects, onEdit, onDelete, onNew }: GroupedProjectListProps) => {
  const userType = useUserType();
  const isStaff = userType === 'staff';
  
  const inProgressProjects = projects.filter(project => project.status !== "Approved");
  const completedProjects = projects.filter(project => project.status === "Approved");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        {isStaff && (
          <Button onClick={onNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">In Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {inProgressProjects.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-4">
                No projects in progress
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Completed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {completedProjects.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-4">
                No completed projects
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GroupedProjectList;