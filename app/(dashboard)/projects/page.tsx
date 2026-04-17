import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectCard from "@/components/dashboard/project-card";
import EmptyState from "@/components/ui/empty-state";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p className="p-6">Unauthorized</p>;
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Your Projects 🚀
      </h1>

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