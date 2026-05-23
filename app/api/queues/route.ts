import { NextResponse }

from "next/server"

let queue:any[]=[]

export async function GET(){

return NextResponse.json(
queue
)

}

export async function POST(
req:Request
){

const body=
await req.json()

queue.push(body)

return NextResponse.json({

success:true

})

}