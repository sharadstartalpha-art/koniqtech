import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const quotes=
await prisma.quote.findMany({

include:{
customer:true,
organization:true
},

orderBy:{
createdAt:"desc"
}

})

return NextResponse.json(
quotes
)

}

export async function POST(
req:Request
){

try{

const body=
await req.json()

const subtotal=
Number(
body.subtotal ?? body.amount ?? 0
)

const tax=
Number(
body.tax ?? 0
)

const total=
subtotal+tax



return NextResponse.json(
"quote"
)

}

catch(error){

console.log(error)

return NextResponse.json(

{
error:
"Unable to create quote"
},

{
status:500
}

)

}

}