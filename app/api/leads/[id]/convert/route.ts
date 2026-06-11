import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where: { id }
  })

  if (!lead) {

    return NextResponse.json(
      { error: "Lead not found" },
      { status: 404 }
    )

  }


const existingCustomer =
  await prisma.customer.findFirst({

    where:{
      leadId:id
    }

  })

if(existingCustomer){

  return NextResponse.json({
    customerId: existingCustomer.id
  })

}


  const customer = await prisma.customer.create({

    data: {

      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      orgId: lead.orgId,
      leadId: lead.id

    }

  })

  await prisma.lead.update({

    where: { id },

    data: {
      status: "converted"
    }

  })

  return NextResponse.json({

    success: true,
    customerId: customer.id

  })

}