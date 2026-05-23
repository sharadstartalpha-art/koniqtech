import { NextResponse } from "next/server"

export async function POST(req:Request){

const body=
await req.json()

return NextResponse.json({

query:
body.query,

results:[

{

title:
"Knowledge Article",

score:.92

}

]

})

}