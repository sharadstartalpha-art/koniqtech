import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const payroll=
await prisma.payroll.findMany({

include:{
user:true
}

})

return NextResponse.json(
payroll
)

}

export async function POST(req:Request){

const body=
await req.json()

const record=
await prisma.payroll.create({

data:{

orgId:
body.orgId,

userId:
body.userId,

hours:
Number(
body.hours
),

amount:
Number(
body.amount
),

status:
body.status
??

"pending"

}

})

return NextResponse.json(
record
)

}