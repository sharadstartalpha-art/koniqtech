import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const items=
await prisma.inventoryItem.findMany({

orderBy:{
createdAt:"desc"
}

})

return NextResponse.json(items)

}

export async function POST(req:Request){

const body=
await req.json()

const item=
await prisma.inventoryItem.create({

data:{

orgId:body.orgId,

name:body.name,

sku:body.sku,

qty:Number(
body.qty
),

unitCost:body.unitCost

?

Number(
body.unitCost
)

:

null

}

})

return NextResponse.json(item)

}