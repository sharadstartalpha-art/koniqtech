import { NextResponse } from "next/server"

let campaigns:any[]=[]

export async function GET(){

return NextResponse.json(
campaigns
)

}

export async function POST(req:Request){

const body=
await req.json()

const item={

id:crypto.randomUUID(),

name:body.name,

type:body.type,

audience:body.audience,

status:"draft"

}

campaigns.push(item)

return NextResponse.json(
item
)

}