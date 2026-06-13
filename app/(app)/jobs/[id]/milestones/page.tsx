import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const milestones =
    await prisma.jobMilestone.findMany({

      where:{
        jobId:id
      },

      orderBy:{
        createdAt:"desc"
      }

    })

  async function createMilestone(
    formData:FormData
  ){

    "use server"

    await prisma.jobMilestone.create({

      data:{
        jobId:id,
        title:String(
          formData.get("title")
        )
      }

    })

    revalidatePath(
      `/jobs/${id}/milestones`
    )
  }

  async function deleteMilestone(
    milestoneId:string
  ){

    "use server"

    await prisma.jobMilestone.delete({

      where:{
        id:milestoneId
      }

    })

    revalidatePath(
      `/jobs/${id}/milestones`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Milestones
      </h1>

      <form
        action={createMilestone}
        className="
        bg-white
        border
        rounded-3xl
        p-6
        flex
        gap-4
        "
      >

        <input
          name="title"
          required
          placeholder="Milestone title"
          className="
          flex-1
          h-14
          border
          rounded-2xl
          px-5
          "
        />

        <button
          className="
          px-8
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Add
        </button>

      </form>

      <div
        className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50 border-b">

              <th className="text-left p-4">
                Title
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Due Date
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {milestones.map(milestone=>(

              <tr
                key={milestone.id}
                className="border-b"
              >

                <td className="p-4">
                  {milestone.title}
                </td>

                <td className="p-4 capitalize">
                  {milestone.status}
                </td>

                <td className="p-4">

                  {
                    milestone.dueDate
                    ? milestone.dueDate.toLocaleDateString()
                    : "-"
                  }

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/jobs/${id}/milestones/${milestone.id}`}
                      className="
                      px-3
                      py-2
                      bg-slate-100
                      rounded-xl
                      "
                    >
                      Edit
                    </Link>

                    <form
                      action={async()=>{

                        "use server"

                        await deleteMilestone(
                          milestone.id
                        )

                      }}
                    >

                      <button
                        className="
                        px-3
                        py-2
                        bg-red-600
                        text-white
                        rounded-xl
                        "
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </td>

              </tr>

            ))}

            {milestones.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="
                  p-8
                  text-center
                  text-slate-500
                  "
                >
                  No milestones found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}