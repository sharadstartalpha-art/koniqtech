import ProjectCard from "@/components/dashboard/project-card";
import EmptyState from "@/components/ui/empty-state";

// TEMP TYPE (replace later with Prisma type)
type Project = {
  id: string;
  name: string;
  product?: {
    name: string;
  };
};

export default async function ProjectsPage() {
  const projects: Project[] = []; // replace with prisma

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}