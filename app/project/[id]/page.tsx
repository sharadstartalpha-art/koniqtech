import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"
import AIChat from "@/app/components/AIChat"

export default async function ProjectPage({ params }: any) {
  const { id } = await params;

  const session = await getServerSession(authOptions)
  

  if (!session?.user?.email) {
    return <div className="p-10">Not logged in</div>
  }

  // ✅ get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <div className="p-10">User not found</div>
  }

  // ✅ get project
 const project = await prisma.project.findUnique({
  where: { id },
  include: {
    product: true, // ✅ ADD THIS
  },
});

// ✅ FIX
if (!project) {
  return <div>Project not found</div>;
}

const messages = await prisma.message.findMany({
  where: { projectId: project.id },
  orderBy: { createdAt: "asc" },
});

  // ❌ not found OR not yours
  if (!project || project.userId !== user.id) {
    return notFound()
  }

 return (
  <div className="p-10 max-w-3xl">
    <h1 className="text-2xl font-bold mb-2">{project.name}</h1>

    <p className="text-gray-600 mb-4">
      Product: {project.product.name}
    </p>

    <p className="text-sm text-gray-400 mb-6">
      Created: {new Date(project.createdAt).toLocaleString()}
    </p>

    {/* 🚀 workspace */}
    <div className="border p-6 rounded mb-6">
      <p className="text-gray-500">
        🚀 Your product workspace will be here
      </p>
    </div>

    {/* ✅ AI CHAT HERE */}
    
   <AIChat projectId={project.id} initialMessages={messages as any} />

    

<a href={`/project/${id}/lead-finder`}>
  Open Lead Finder
</a>
  </div>
  
)
}
