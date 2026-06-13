import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({
  params
}:any){

  const { id } = await params

  const items =
    await prisma.punchItem.findMany({
      where:{ jobId:id }
    })

  async function create(
    formData:FormData
  ){

    "use server"

    await prisma.punchItem.create({

      data:{
        jobId:id,
        title:String(formData.get("title"))
      }

    })

    revalidatePath(
      `/jobs/${id}/punch`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Punch List
      </h1>

      <form
        action={create}
        className="bg-white border rounded-3xl p-6 flex gap-4"
      >

        <input
          name="title"
          placeholder="Punch Item"
          className="flex-1 h-14 border rounded-2xl px-4"
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

              <th className="p-4 text-left">
                Item
              </th>

              <th className="p-4 text-left">
                Completed
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map(item=>(

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-4">
                  {item.title}
                </td>

                <td className="p-4">
                  {item.completed ? "Yes" : "No"}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/jobs/${id}/punch/${item.id}`}
                      className="px-3 py-2 bg-slate-100 rounded-xl"
                    >
                      Edit
                    </Link>

                    <form
                      action={async()=>{

                        "use server"

                        await prisma.punchItem.delete({
                          where:{ id:item.id }
                        })

                        revalidatePath(
                          `/jobs/${id}/punch`
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