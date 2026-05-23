import { NextResponse } from "next/server"

let notifications:any[]=[]

export async function GET(){

return NextResponse.json(
notifications
)

}

export async function POST(req:Request){

const body=
await req.json()

const n={

id:crypto.randomUUID(),

title:body.title,

message:body.message,

channel:body.channel

}

notifications.push(n)

return NextResponse.json(n)

}