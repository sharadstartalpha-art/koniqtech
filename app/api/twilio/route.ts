import { NextResponse } from "next/server"
import Twilio from "twilio"

const client=Twilio(

process.env.TWILIO_SID!,
process.env.TWILIO_TOKEN!

)

export async function POST(req:Request){

const body=await req.json()

const msg=
await client.messages.create({

body:body.message,

from:
process.env.THONE_NUMBER,

to:
body.phone

})

return NextResponse.json(
msg
)

}