import {openai}

from "@/shared/lib/openai"

export async function askAI(

prompt:string

){

const res=

await openai.chat.completions.create({

model:

"gpt-4o-mini",

messages:[

{

role:"user",

content:prompt

}

]

})

return res

}