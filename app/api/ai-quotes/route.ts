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

const quote=
await prisma.quote.create({

data:{

quoteNumber:
`Q-${
Date.now()
}`,

subtotal,

tax,

total,

status:
"draft",

customer:{
connect:{
id:
body.customerId
}
},

organization:{
connect:{
id:
body.orgId
}
}

},

include:{
customer:true,
organization:true
}

})

return NextResponse.json(
quote
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