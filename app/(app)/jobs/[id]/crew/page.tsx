import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const technicians =
    await prisma.user.findMany({
      where:{
        role:"technician"
      }
    })

  const crew =
    await prisma.crewAssignment.findMany({
      where:{
        jobId:id
      },
      include:{
        user:true
      }
    })

  async function assignTechnician(
    formData:FormData
  ){

    "use server"

    const userId =
      String(
        formData.get("userId")
      )

    await prisma.crewAssignment.create({

      data:{

        jobId:id,

        userId,

        role:"technician"

      }

    })

    revalidatePath(
      `/jobs/${id}/crew`
    )

  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Crew
      </h1>

      <form
        action={assignTechnician}
        className="flex gap-4"
      >

        <select
          name="userId"
          className="
          flex-1
          h-14
          border
          rounded-2xl
          px-4
          "
        >

          <option value="">
            Select Technician
          </option>

          {
            technicians.map(t=>(
              <option
                key={t.id}
                value={t.id}
              >
                {t.name}
              </option>
            ))
          }

        </select>

        <button
          className="
          px-8
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Assign
        </button>

      </form>

      {
        crew.length===0 && (

          <div className="
          bg-white
          border
          rounded-3xl
          p-6
          ">
            No crew assigned
          </div>

        )
      }

      {
        crew.map(x=>(

          <div
            key={x.id}
            className="
            bg-white
            border
            rounded-3xl
            p-6
            "
          >

            <div className="font-semibold">
              {x.user.name}
            </div>

            <div className="text-slate-500">
              {x.role}
            </div>

          </div>

        ))
      }

    </div>

  )

}