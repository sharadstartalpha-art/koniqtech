import OpenAI from "openai"

const client=

new OpenAI({

apiKey:

process.env.OPENAI_API_KEY

})

export async function scoreLead(

text:string

){

const response=

await client.chat.completions.create({

model:"gpt-4o",

messages:[

{

role:"system",

content:

"Score lead from 1-100"

},

{

role:"user",

content:text

}

]

})

return response
.choices[0]
.message
.content

}

export async function summarizeCall(

transcript:string

){

const response=

await client.chat.completions.create({

model:"gpt-4o",

messages:[

{

role:"user",

content:

transcript

}

]

})

return response
.choices[0]
.message
.content

}