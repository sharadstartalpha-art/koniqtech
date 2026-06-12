import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params: Promise<{ id:string }>
}) {

  const { id } = await params

  const job = await prisma.job.findUnique({
    where:{ id },
    include:{
      technician:true,
      customer:true
    }
  })

  async function save(formData:FormData){

    "use server"

    const value =
      String(
        formData.get("date")
      )

    if(!value) return

    await prisma.job.update({
      where:{ id },
      data:{
        scheduledDate:new Date(value)
      }
    })

    revalidatePath(`/jobs/${id}/schedule`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Schedule Job
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

        <input
          type="datetime-local"
          name="date"
          defaultValue={
            job?.scheduledDate
              ? new Date(job.scheduledDate)
                  .toISOString()
                  .slice(0,16)
              : ""
          }
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-5
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
          Save Schedule
        </button>

      </form>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="
        bg-white
        border
        rounded-3xl
        p-6
        ">
          <p className="text-slate-500">
            Current Schedule
          </p>

          <h2 className="text-xl font-bold mt-3">
            {
              job?.scheduledDate
              ? job.scheduledDate.toLocaleString()
              : "Not Scheduled"
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
            Technician
          </p>

          <h2 className="text-xl font-bold mt-3">
            {
              job?.technician?.name ||
              "Not Assigned"
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
            Customer
          </p>

          <h2 className="text-xl font-bold mt-3">
            {
              job?.customer?.firstName ||
              "-"
            }
          </h2>
        </div>

      </div>

    </div>

  )

}