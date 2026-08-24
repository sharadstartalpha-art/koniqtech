import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

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

  const fileName =
    String(formData.get("fileName"))

  const url =
    String(formData.get("url"))

  if (!fileName || !url) {
    throw new Error("File name and URL are required.")
  }

  await prisma.customerFile.create({

    data: {

      orgId,

      customerId,

      fileName,

      url

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
      className="
      max-w-2xl
      mx-auto
      space-y-8
      "
    >

      <input
        type="hidden"
        name="customerId"
        value={customer.id}
      />

      <div>

        <Link
          href={`/customers/${customer.id}/files`}
          className="
          text-slate-500
          hover:text-orange-600
          "
        >
          ← Back to Files
        </Link>

        <h1 className="
        text-4xl
        font-bold
        mt-4
        ">
          Upload Customer File
        </h1>

      </div>

      <div className="
      bg-white
      border
      rounded-3xl
      p-8
      space-y-6
      ">

        <div>

          <label className="block mb-2 font-medium">
            File Name
          </label>

          <input
            name="fileName"
            required
            className="
            w-full
            border
            rounded-xl
            p-4
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            File URL
          </label>

          <input
            name="url"
            required
            placeholder="https://..."
            className="
            w-full
            border
            rounded-xl
            p-4
            "
          />

        </div>

      </div>

      <button
        className="
        bg-orange-600
        hover:bg-orange-700
        text-white
        px-8
        py-4
        rounded-2xl
        "
      >
        Save File
      </button>

    </form>

  )

}