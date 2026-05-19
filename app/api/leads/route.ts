import {NextResponse} from "next/server"
import prisma from "@/shared/lib/prisma"

export async function GET(){

const data=await prisma.lead.findMany()

return NextResponse.json(data)

}

export async function POST(req:Request){

const body=await req.json()

const lead=await prisma.lead.create({

data:body

})

return NextResponse.json(lead)

}