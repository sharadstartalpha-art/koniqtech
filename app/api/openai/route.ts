import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai=
new OpenAI({

apiKey:
process.env.OPENAI_API_KEY

})

export async function POST(req:Request){

const body=
await req.json()

const res=
await openai.chat.completions.create({

model:"gpt-4o",

messages:[

{
role:"user",
content:body.prompt
}

]

})

return NextResponse.json(
res.choices[0]
)

}