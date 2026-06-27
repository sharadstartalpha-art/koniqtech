import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const materials =
    await prisma.materialRequest.findMany({
      where:{ jobId:id },
      orderBy:{ name:"asc" }
    })

  async function createMaterial(
    formData:FormData
  ){

    "use server"

    await prisma.materialRequest.create({

      data:{
        jobId:id,
        name:String(formData.get("name")),
        quantity: String(formData.get("qty")),
      }

    })

    revalidatePath(`/jobs/${id}/materials`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Materials
      </h1>

      <form
        action={createMaterial}
        className="bg-white border rounded-3xl p-6 flex gap-4"
      >

        <input
          name="name"
          placeholder="Material Name"
          className="flex-1 h-14 border rounded-2xl px-4"
        />

        <input
          name="qty"
          type="number"
          placeholder="Qty"
          className="w-40 h-14 border rounded-2xl px-4"
        />

        <button
          className="px-8 bg-blue-600 text-white rounded-2xl"
        >
          Add
        </button>

      </form>

      <div className="bg-white border rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-4 text-left">Material</th>
              <th className="p-4 text-left">Qty</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {materials.map(material=>(

              <tr
                key={material.id}
                className="border-b"
              >

                <td className="p-4">{material.name}</td>

                <td className="p-4">{material.quantity.toString()}</td>

                <td className="p-4 capitalize">
                  {material.status}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/jobs/${id}/materials/${material.id}`}
                      className="px-3 py-2 bg-slate-100 rounded-xl"
                    >
                      Edit
                    </Link>

                    <form
                      action={async()=>{

                        "use server"

                        await prisma.materialRequest.delete({
                          where:{ id:material.id }
                        })

                        revalidatePath(
                          `/jobs/${id}/materials`
                        )

                      }}
                    >

                      <button
                        className="px-3 py-2 bg-red-600 text-white rounded-xl"
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}