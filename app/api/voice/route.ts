import { NextResponse } from "next/server"

const agents=[

{

id:"1",

name:
"Inbound AI",

status:
"online"

},

{

id:"2",

name:
"Outbound AI",

status:
"idle"

},

{

id:"3",

name:
"Booking AI",

status:
"online"

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

agent:body

})

}