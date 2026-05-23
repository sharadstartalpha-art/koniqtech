import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const customers=
await prisma.customer.findMany({

take:50

})

return NextResponse.json(
customers
)

}