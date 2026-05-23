import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const plans=
await prisma.routePlan.findMany({

include:{

job:true

}

})

return NextResponse.json(
plans
)

}

export async function POST(req:Request){

const body=
await req.json()

const route=
await prisma.routePlan.create({

data:{

jobId:
body.jobId,

technicianId:
body.technicianId,

distance:
Number(
body.distance
),

duration:
Number(
body.duration
)

}

})

return NextResponse.json(
route
)

}