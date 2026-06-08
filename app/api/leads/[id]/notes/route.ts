import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: any
) {

  const notes =
    await prisma.leadNote.findMany({

      where: {
        leadId: params.id
      },

      orderBy: {
        createdAt: "desc"
      }

    })

  return NextResponse.json(notes)

}

export async function POST(
  req: Request,
  { params }: any
) {

  const body = await req.json()

  const note =
    await prisma.leadNote.create({

      data: {

        leadId: params.id,

        content: body.content

      }

    })

  return NextResponse.json(note)

}