import OpenAI

from "openai"

const openai=

new OpenAI({

apiKey:

process.env.OPENAI_API_KEY

})

export async function executeAI(

prompt:string

){

const result=

await openai.chat.completions.create({

model:

"gpt-4.1",

messages:[

{

role:"user",

content:prompt

}

]

})

return result

.choices[0]

.message

.content

}