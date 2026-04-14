import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import AIChat from "@/components/AIChat";

export default async function ProjectPage({ params }: any) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-10">Not logged in</div>;
  }

  // ✅ get project with team relation
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      product: true,
      team: true,
    },
  });

  if (!project) {
    return notFound();
  }

  // 🔐 SECURITY (user must belong to team OR own project)
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId: project.teamId!,
      userId: session.user.id,
    },
  });

  if (!member && project.userId !== session.user.id) {
    return notFound();
  }

  // ✅ messages
  const messages = await prisma.message.findMany({
    where: {
      chat: {
        projectId: project.id,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>

      <p className="text-gray-600 mb-4">
        Product: {project.product.name}
      </p>

      <p className="text-sm text-gray-400 mb-6">
        Created: {new Date(project.createdAt).toLocaleString()}
      </p>

      {/* 🚀 TEAM WORKSPACE */}
      <div className="border p-6 rounded mb-6">
        <p className="text-gray-500">
          🚀 Team workspace active
        </p>
      </div>

      {/* 🤖 AI CHAT */}
      <AIChat
        projectId={project.id}
        initialMessages={messages as any}
      />

      <a
        href={`/project/${id}/lead-finder`}
        className="text-blue-600 underline mt-4 block"
      >
        Open Lead Finder
      </a>
    </div>
  );
}