import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const locations=
await prisma.technicianLocation.findMany({

include:{
technician:true
}

})

return NextResponse.json(
locations
)

}

export async function POST(req:Request){

const body=
await req.json()

const location=
await prisma.technicianLocation.create({

data:{

techId:
body.techId,

lat:
Number(
body.lat
),

lng:
Number(
body.lng
)

}

})

return NextResponse.json(
location
)

}