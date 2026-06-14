import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

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
        title:"asc"
      }

    })

  async function saveDependency(
    formData:FormData
  ){

    "use server"

    const taskId =
      String(
        formData.get("taskId")
      )

    const dependsOnId =
      String(
        formData.get("dependsOnId")
      )

    if(
      !taskId ||
      !dependsOnId ||
      taskId === dependsOnId
    ){
      return
    }

    await prisma.jobTask.update({

      where:{
        id:taskId
      },

      data:{
        dependsOnId
      }

    })

    revalidatePath(
      `/jobs/${id}/dependencies`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Task Dependencies
      </h1>

      <form
        action={saveDependency}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-5
        "
      >

        <div>

          <label className="block mb-2">
            Task
          </label>

          <select
            name="taskId"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          >

            <option value="">
              Select Task
            </option>

            {tasks.map(task=>(

              <option
                key={task.id}
                value={task.id}
              >
                {task.title}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block mb-2">
            Depends On
          </label>

          <select
            name="dependsOnId"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          >

            <option value="">
              Select Dependency
            </option>

            {tasks.map(task=>(

              <option
                key={task.id}
                value={task.id}
              >
                {task.title}
              </option>

            ))}

          </select>

        </div>

        <button
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Save Dependency
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

              <th className="p-4 text-left">
                Task
              </th>

              <th className="p-4 text-left">
                Depends On
              </th>

            </tr>

          </thead>

          <tbody>

            {await Promise.all(

              tasks.map(async task=>{

                const dependency =
                  task.dependsOnId
                  ? await prisma.jobTask.findUnique({
                      where:{
                        id:task.dependsOnId
                      }
                    })
                  : null

                return(

                  <tr
                    key={task.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {task.title}
                    </td>

                    <td className="p-4">

                      {
                        dependency?.title ||
                        "-"
                      }

                    </td>

                  </tr>

                )

              })

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}