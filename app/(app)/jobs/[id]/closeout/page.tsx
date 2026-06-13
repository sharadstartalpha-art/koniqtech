import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  let closeout =
    await prisma.closeoutPackage.findFirst({

      where:{
        jobId:id
      }

    })

  async function save(
    formData:FormData
  ){

    "use server"

    const notes =
      String(
        formData.get("notes") || ""
      )

    const completed =
      formData.get("completed")
      === "on"

    const existing =
      await prisma.closeoutPackage.findFirst({

        where:{
          jobId:id
        }

      })

    if(existing){

      await prisma.closeoutPackage.update({

        where:{
          id:existing.id
        },

        data:{
          notes,
          completed
        }

      })

    }else{

      await prisma.closeoutPackage.create({

        data:{
          jobId:id,
          notes,
          completed
        }

      })

    }

    revalidatePath(
      `/jobs/${id}/closeout`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Closeout Package
      </h1>

      <form
        action={save}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <div>

          <label className="block mb-2 font-medium">
            Closeout Notes
          </label>

          <textarea
            name="notes"
            rows={10}
            defaultValue={
              closeout?.notes || ""
            }
            className="
            w-full
            border
            rounded-2xl
            p-4
            "
          />

        </div>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="completed"
            defaultChecked={
              closeout?.completed || false
            }
          />

          Job Closeout Completed

        </label>

        <button
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Save Closeout
        </button>

      </form>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="
        bg-white
        border
        rounded-3xl
        p-6
        ">

          <p className="text-slate-500">
            Status
          </p>

          <h2 className="text-2xl font-bold mt-3">

            {
              closeout?.completed
              ? "Completed"
              : "Pending"
            }

          </h2>

        </div>

        <div className="
        bg-white
        border
        rounded-3xl
        p-6
        ">

          <p className="text-slate-500">
            Notes Length
          </p>

          <h2 className="text-2xl font-bold mt-3">

            {
              closeout?.notes?.length || 0
            }

            {" "}characters

          </h2>

        </div>

      </div>

    </div>

  )

}