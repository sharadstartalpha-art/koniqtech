import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"

export default async function Page({
  params
}:any){

  const {
    id,
    punchId
  } = await params

  const item =
    await prisma.punchItem.findUnique({
      where:{
        id:punchId
      }
    })

  if(!item){
    notFound()
  }

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.punchItem.update({

      where:{
        id:punchId
      },

      data:{
        title:String(formData.get("title")),
        completed:
          formData.get("completed")
          === "on"
      }

    })

    revalidatePath(`/jobs/${id}/punch-list`)

    redirect(`/jobs/${id}/punch-list`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Edit Punch Item
      </h1>

      <form
        action={save}
        className="bg-white border rounded-3xl p-8 space-y-5"
      >

        <input
          name="title"
          defaultValue={item.title}
          className="w-full h-14 border rounded-2xl px-4"
        />

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="completed"
            defaultChecked={item.completed}
          />

          Completed

        </label>

        <button
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl"
        >
          Save Changes
        </button>

      </form>

    </div>

  )

}