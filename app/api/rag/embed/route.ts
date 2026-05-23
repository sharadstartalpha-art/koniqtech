import { OpenAIEmbeddings }

from "@langchain/openai"

export async function POST(req:Request){

const body=
await req.json()

const embed=
new OpenAIEmbeddings()

const vector=
await embed.embedQuery(

body.text

)

return Response.json(
vector
)

}