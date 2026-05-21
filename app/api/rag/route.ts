import{

NextResponse

}

from "next/server"

import{

search

}

from "@/server/rag/search"

export async function POST(

req:Request

){

const body=

await req.json()

const data=

await search(

body.query

)

return NextResponse.json(

data

)

}