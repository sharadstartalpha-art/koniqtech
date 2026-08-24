import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  S3Client,
  GetObjectCommand
} from "@aws-sdk/client-s3"

import { NextRequest, NextResponse } from "next/server"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function GET(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  const session = await auth()

  if (!session?.user) {

    return NextResponse.json(
      {
        message: "Unauthorized"
      },
      {
        status: 401
      }
    )

  }

  const orgId = session.user.orgId

  if (!orgId) {

    return NextResponse.json(
      {
        message: "Unauthorized"
      },
      {
        status: 401
      }
    )

  }

  const { id } = await params

  const file =
    await prisma.customerFile.findFirst({

      where: {
        id,
        orgId
      }

    })

  if (!file) {

    return NextResponse.json(
      {
        message: "File not found"
      },
      {
        status: 404
      }
    )

  }

  //
  // IMPORTANT
  // If you stored the full S3 URL in fileUrl,
  // extract the object key from it.
  //

  let key = file.fileUrl

  if (key.startsWith("http")) {

    const url = new URL(key)

    key = decodeURIComponent(
      url.pathname.substring(1)
    )

  }

  const object =
    await s3.send(

      new GetObjectCommand({

        Bucket:
          process.env.AWS_BUCKET_NAME,

        Key:
          key

      })

    )

  const download =
    req.nextUrl.searchParams.get("download")

  return new NextResponse(

    object.Body as ReadableStream,

    {

      headers: {

        "Content-Type":
          object.ContentType ??
          "application/octet-stream",

        "Content-Length":
          String(
            object.ContentLength ?? ""
          ),

        "Content-Disposition":

          download

            ? `attachment; filename="${file.fileName}"`

            : `inline; filename="${file.fileName}"`

      }

    }

  )

}