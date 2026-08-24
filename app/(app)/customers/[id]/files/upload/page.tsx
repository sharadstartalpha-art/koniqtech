import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const dynamic = "force-dynamic"

async function uploadFile(
  formData: FormData
) {

  "use server"

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customerId =
    String(formData.get("customerId"))

  const file =
    formData.get("file") as File

  if (!file || file.size === 0) {
    throw new Error("Please select a file.")
  }

  const bytes =
    await file.arrayBuffer()

  const buffer =
    Buffer.from(bytes)

  const key =
    `customers/${customerId}/${Date.now()}-${file.name}`

  await s3.send(

    new PutObjectCommand({

      Bucket:
        process.env.AWS_BUCKET_NAME,

      Key:
        key,

      Body:
        buffer,

      ContentType:
        file.type

    })

  )

  const fileUrl  =
    `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  await prisma.customerFile.create({

    data: {

      orgId,

      customerId,

      fileName:
        file.name,

      fileUrl,

      fileSize:
        file.size,

      fileType:
        file.type

    }

  })

  redirect(`/customers/${customerId}/files`)

}

export default async function Page({

  params

}:{

  params:Promise<{
    id:string
  }>

}){

  const session =
    await auth()

  if(!session?.user){
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if(!orgId){
    redirect("/welcome")
  }

  const { id } =
    await params

  const customer =
    await prisma.customer.findFirst({

      where:{
        id,
        orgId
      }

    })

  if(!customer){
    notFound()
  }

  return(

    <form
      action={uploadFile}
      className="max-w-2xl mx-auto space-y-8"
    >

      <input
        type="hidden"
        name="customerId"
        value={customer.id}
      />

      <div>

        <Link
          href={`/customers/${customer.id}/files`}
          className="text-slate-500 hover:text-orange-600"
        >
          ← Back to Files
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Upload Customer File
        </h1>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <label className="block mb-3 font-medium">
          Select File
        </label>

        <input
          type="file"
          name="file"
          required
          className="w-full border rounded-xl p-4"
        />

      </div>

      <button
        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
      >
        Upload File
      </button>

    </form>

  )

}