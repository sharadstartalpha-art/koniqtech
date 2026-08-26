import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const logs=
await prisma.warehouseTransaction.findMany({



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


return NextResponse.json(
"hello"
)

}