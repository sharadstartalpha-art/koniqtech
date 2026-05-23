import prisma from "@/shared/lib/prisma"

export async function GET(){

const orgs=
await prisma.organization.findMany()

return Response.json(
orgs
)

}