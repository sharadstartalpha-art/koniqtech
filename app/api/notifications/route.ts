import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  const notifications =
    await prisma.notification.findMany({

      orderBy:{
        createdAt:"desc"
      },

      take:20

    })

  return NextResponse.json(
    notifications
  )

}

export async function POST(
  req:Request
){

  const body =
    await req.json()

  const notification =
    await prisma.notification.create({

      data:{

        orgId:body.orgId,

        userId:body.userId,

        title:body.title,

        message:body.message,

        type:body.type || "general"

      }

    })

  return NextResponse.json(
    notification
  )

}