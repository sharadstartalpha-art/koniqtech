import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

let messages:any[]=[]

export async function GET(){

return NextResponse.json(
messages
)

}

export async function POST(req:Request){

const body=
await req.json()

const msg={

id:crypto.randomUUID(),

phone:body.phone,

message:body.message,

status:"queued",

createdAt:new Date()

}

messages.push(msg)

return NextResponse.json(msg)

}