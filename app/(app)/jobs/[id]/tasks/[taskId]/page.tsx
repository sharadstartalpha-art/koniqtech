import prisma from "@/shared/lib/prisma"
import { redirect } from "next/navigation"

export default async function Page({
  params
}:{
  params:Promise<{
    id:string
    taskId:string
  }>
}){

  const {
    id,
    taskId
  } = await params

  const task =
    await prisma.jobTask.findUnique({
      where:{
        id:taskId
      }
    })

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.jobTask.update({

      where:{
        id:taskId
      },

      data:{
        title:String(formData.get("title")),
        status:String(formData.get("status"))
      }

    })

    redirect(`/jobs/${id}/tasks`)
  }

  return(

    <form
      action={save}
      className="
      bg-white
      border
      rounded-3xl
      p-8
      space-y-4
      "
    >

      <input
        name="title"
        defaultValue={task?.title}
        className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        "
      />

      <select
        name="status"
        defaultValue={task?.status}
        className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        "
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <button
        className="
        px-8
        py-4
        bg-blue-600
        text-white
        rounded-2xl
        "
      >
        Save
      </button>

    </form>

  )

}