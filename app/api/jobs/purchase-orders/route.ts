import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body=
await req.json()

return NextResponse.json(

await prisma.purchaseOrder.create({

data:body

})

)

}