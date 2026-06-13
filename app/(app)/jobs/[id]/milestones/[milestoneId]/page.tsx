import prisma from "@/shared/lib/prisma"
import { redirect } from "next/navigation"

export default async function Page({
  params
}:{
  params:Promise<{
    id:string
    milestoneId:string
  }>
}){

  const {
    id,
    milestoneId
  } = await params

  const milestone =
    await prisma.jobMilestone.findUnique({
      where:{
        id:milestoneId
      }
    })

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.jobMilestone.update({

      where:{
        id:milestoneId
      },

      data:{
        title:String(formData.get("title"))
      }

    })

    redirect(`/jobs/${id}/milestones`)
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
        defaultValue={milestone?.title}
        className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        "
      />

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