import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{
    id:string
    materialId:string
  }>
}){

  const {
    id,
    materialId
  } = await params

  const material =
    await prisma.materialRequest.findUnique({
      where:{ id:materialId }
    })

  if(!material){
    notFound()
  }

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.materialRequest.update({

      where:{
        id:materialId
      },

      data:{
        name:String(formData.get("name")),
        qty:Number(formData.get("qty")),
        status:String(formData.get("status"))
      }

    })

    revalidatePath(`/jobs/${id}/materials`)

    redirect(`/jobs/${id}/materials`)
  }

  return(

    <div className="space-y-8">

      <div className="flex justify-between">

        <h1 className="text-5xl font-bold">
          Edit Material
        </h1>

        <Link
          href={`/jobs/${id}/materials`}
          className="px-5 py-3 border rounded-2xl"
        >
          Back
        </Link>

      </div>

      <form
        action={save}
        className="bg-white border rounded-3xl p-8 space-y-5"
      >

        <input
          name="name"
          defaultValue={material.name}
          className="w-full h-14 border rounded-2xl px-4"
        />

        <input
          name="qty"
          type="number"
          defaultValue={material.qty}
          className="w-full h-14 border rounded-2xl px-4"
        />

        <select
          name="status"
          defaultValue={material.status}
          className="w-full h-14 border rounded-2xl px-4"
        >
          <option value="requested">Requested</option>
          <option value="ordered">Ordered</option>
          <option value="received">Received</option>
        </select>

        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl">
          Save Changes
        </button>

      </form>

    </div>

  )

}