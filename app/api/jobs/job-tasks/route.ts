import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body=
await req.json()

const row=

await prisma.jobTask.create({

data:body

})

return NextResponse.json(row)

}