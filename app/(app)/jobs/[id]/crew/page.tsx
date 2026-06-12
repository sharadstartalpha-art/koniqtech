import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params: Promise<{id:string}>
}) {

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
      },
      orderBy:{
        assignedAt:"desc"
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

    if(!userId) return

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

  async function createCrew(
    formData:FormData
  ){

    "use server"

    await prisma.crewAssignment.create({

      data:{
        jobId:id,
        name:String(formData.get("name")),
        phone:String(formData.get("phone")),
        role:String(formData.get("role"))
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

      <div className="grid lg:grid-cols-2 gap-8">

        <form
          action={assignTechnician}
          className="
          bg-white
          border
          rounded-3xl
          p-6
          space-y-4
          "
        >

          <h2 className="text-xl font-semibold">
            Assign Technician
          </h2>

          <select
            name="userId"
            className="
            w-full
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
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-2xl
            "
          >
            Assign
          </button>

        </form>

        <form
          action={createCrew}
          className="
          bg-white
          border
          rounded-3xl
          p-6
          space-y-4
          "
        >

          <h2 className="text-xl font-semibold">
            Create Crew Member
          </h2>

          <input
            name="name"
            placeholder="Name"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          />

          <input
            name="phone"
            placeholder="Phone"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          />

          <input
            name="role"
            placeholder="Role"
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
            bg-green-600
            text-white
            px-6
            py-3
            rounded-2xl
            "
          >
            Save
          </button>

        </form>

      </div>

      <div className="space-y-4">

        {
          crew.length === 0 && (

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
          crew.map(member=>(

            <div
              key={member.id}
              className="
              bg-white
              border
              rounded-3xl
              p-6
              "
            >

              <div className="font-semibold text-lg">
                {
                  member.user?.name ||
                  member.name
                }
              </div>

              <div className="text-slate-500">
                {member.role}
              </div>

              {
                member.phone && (
                  <div className="text-sm mt-1">
                    {member.phone}
                  </div>
                )
              }

            </div>

          ))
        }

      </div>

    </div>

  )

}