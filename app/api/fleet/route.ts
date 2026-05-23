import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const vehicles=
await prisma.fleetVehicle.findMany()

return NextResponse.json(
vehicles
)

}

export async function POST(req:Request){

const body=
await req.json()

const vehicle=
await prisma.fleetVehicle.create({

data:{

orgId:body.orgId,

name:body.name,

vin:body.vin,

gpsId:body.gpsId,

status:
body.status
??

"active"

}

})

return NextResponse.json(
vehicle
)

}