import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const vehicles =
await prisma.fleetVehicle.findMany()

return NextResponse.json(
vehicles
)

}

export async function POST(req: Request) {

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()

  const vehicle = await prisma.fleetVehicle.create({
    data: {
      orgId: session.user.orgId,

      vehicleNumber: body.vehicleNumber,

      name: body.name,

      make: body.make,

      model: body.model,

      year: body.year,

      vin: body.vin,

      registrationNumber: body.registrationNumber,

      gpsDeviceId: body.gpsDeviceId, // <-- renamed

      fuelType: body.fuelType,

      odometer: body.odometer,

      active: body.active ?? true,
    },
  })

  return NextResponse.json(vehicle)
}