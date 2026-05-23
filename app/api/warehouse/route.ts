import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const logs=
await prisma.warehouseTransaction.findMany({

include:{
item:true
},

orderBy:{
createdAt:"desc"
}

})

return NextResponse.json(
logs
)

}

export async function POST(req:Request){

const body=
await req.json()

const tx=
await prisma.warehouseTransaction.create({

data:{

itemId:
body.itemId,

qty:
Number(
body.qty
),

type:
body.type

}

})

return NextResponse.json(
tx
)

}