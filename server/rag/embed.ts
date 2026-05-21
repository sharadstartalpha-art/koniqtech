import OpenAI

from "openai"

const openai=

new OpenAI({

apiKey:

process.env.OPENAI_API_KEY

})

export async function embed(

text:string

){

return await openai

.embeddings

.create({

model:

"text-embedding-3-small",

input:text

})

}