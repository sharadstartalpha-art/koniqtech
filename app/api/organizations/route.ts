import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

export async function GET() {

  const session =
    await auth()

  const userId =
    (session?.user as any)?.id

  if (!userId) {

    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    )

  }

  const user =
    await prisma.user.findUnique({

      where: {
        id: userId
      },

      include: {
        organization: true
      }

    })

  if (!user?.organization) {

    return Response.json([])

  }

  return Response.json([
    {
      id: user.organization.id,
      name: user.organization.name,
      slug: user.organization.slug
    }
  ])

}