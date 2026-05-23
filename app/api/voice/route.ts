import OpenAI from "openai"

const openai=
new OpenAI({

apiKey:
process.env.OPENAI_API_KEY

})

export async function POST(){

const speech=
await openai.audio.speech.create({

model:"tts-1",

voice:"nova",

input:
"Technician dispatched"

})

return new Response(
speech.body
)

}