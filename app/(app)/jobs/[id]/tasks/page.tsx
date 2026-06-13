import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const tasks =
    await prisma.jobTask.findMany({

      where:{
        jobId:id
      },

      orderBy:{
        createdAt:"desc"
      }

    })

  async function createTask(
    formData:FormData
  ){

    "use server"

    await prisma.jobTask.create({

      data:{
        jobId:id,
        title:String(formData.get("title")),
        status:"pending"
      }

    })

    revalidatePath(`/jobs/${id}/tasks`)
  }

  async function deleteTask(
    taskId:string
  ){

    "use server"

    await prisma.jobTask.delete({

      where:{
        id:taskId
      }

    })

    revalidatePath(`/jobs/${id}/tasks`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Tasks
      </h1>

      <form
        action={createTask}
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
          placeholder="Task"
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

      <div className="
      bg-white
      border
      rounded-3xl
      overflow-hidden
      ">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50 border-b">

              <th className="text-left p-4">
                Task
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.map(task=>(

              <tr
                key={task.id}
                className="border-b"
              >

                <td className="p-4">
                  {task.title}
                </td>

                <td className="p-4 capitalize">
                  {task.status}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/jobs/${id}/tasks/${task.id}`}
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

                        await deleteTask(task.id)

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

          </tbody>

        </table>

      </div>

    </div>

  )

}