import { prisma } from "../../../../lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new Response("Project ID required", { status: 400 })
  }

  await prisma.project.delete({
    where: { id: params.id },
  })

  return Response.redirect("http://localhost:3000/dashboard")
}