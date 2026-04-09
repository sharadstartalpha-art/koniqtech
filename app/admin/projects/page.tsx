import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export default async function ProjectsPage() {
  // 🔐 MUST BE FIRST
  await requireAdmin();

  const projects = await prisma.project.findMany({
    include: { user: true, product: true },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Projects</h1>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{p.name}</p>
            <p>User: {p.user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}