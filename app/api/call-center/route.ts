import { NextResponse } from "next/server"

const agents=[

{

id:"1",

name:"Inbound AI"

},

{

id:"2",

name:"Booking AI"

}

]

export async function GET(){

return NextResponse.json(
agents
)

}

export async function POST(req:Request){

const body=
await req.json()

return NextResponse.json({

success:true,

call:body

})

}