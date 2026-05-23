import { NextResponse } from "next/server"

let points:any[]=[]

export async function GET(){

return NextResponse.json(
points
)

}

export async function POST(req:Request){

const body=
await req.json()

points.push(body)

return NextResponse.json(body)

}