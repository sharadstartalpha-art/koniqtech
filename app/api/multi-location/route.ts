import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const orgs=
await prisma.organization.findMany()

return NextResponse.json(
orgs
)

}