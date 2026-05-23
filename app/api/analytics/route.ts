import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const leads=
await prisma.lead.count()

const customers=
await prisma.customer.count()

const jobs=
await prisma.job.count()

return NextResponse.json({

leads,

customers,

jobs

})

}