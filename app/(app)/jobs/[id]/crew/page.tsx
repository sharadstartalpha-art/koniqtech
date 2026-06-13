import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const crewMembers =
    await prisma.crewMember.findMany({

      where:{
        active:true
      },

      orderBy:{
        name:"asc"
      }

    })

  const assignedCrew =
    await prisma.crewAssignment.findMany({

      where:{
        jobId:id
      },

      include:{
        crew:true
      },

      orderBy:{
        assignedAt:"desc"
      }

    })

  async function assignCrew(
    formData:FormData
  ){

    "use server"

    const crewId =
      String(
        formData.get("crewId")
      )

    if(!crewId){
      return
    }

    const exists =
      await prisma.crewAssignment.findFirst({

        where:{
          jobId:id,
          crewId
        }

      })

    if(exists){
      return
    }

    await prisma.crewAssignment.create({

      data:{
        jobId:id,
        crewId
      }

    })

    revalidatePath(
      `/jobs/${id}/crew`
    )
  }

  async function removeCrew(
    assignmentId:string
  ){

    "use server"

    await prisma.crewAssignment.delete({

      where:{
        id:assignmentId
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
        action={assignCrew}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Assign Crew Member
        </h2>

        <select
          name="crewId"
          required
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        >

          <option value="">
            Select Crew Member
          </option>

          {crewMembers.map(member=>(

            <option
              key={member.id}
              value={member.id}
            >
              {member.name} ({member.role})
            </option>

          ))}

        </select>

        <button
          className="
          bg-blue-600
          text-white
          px-8
          py-4
          rounded-2xl
          "
        >
          Assign To Job
        </button>

      </form>

      <div className="space-y-4">

        {assignedCrew.length === 0 && (

          <div
            className="
            bg-white
            border
            rounded-3xl
            p-6
            "
          >
            No crew assigned
          </div>

        )}

        {assignedCrew.map(item=>(

          <div
            key={item.id}
            className="
            bg-white
            border
            rounded-3xl
            p-6
            flex
            items-center
            justify-between
            "
          >

            <div>

              <div className="font-semibold text-lg">
                {item.crew.name}
              </div>

              <div className="text-slate-500">
                {item.crew.role}
              </div>

              {item.crew.phone && (

                <div className="text-sm mt-1">
                  {item.crew.phone}
                </div>

              )}

            </div>

            <form
              action={async()=>{

                "use server"

                await removeCrew(
                  item.id
                )

              }}
            >

              <button
                className="
                px-4
                py-2
                bg-red-600
                text-white
                rounded-xl
                "
              >
                Remove
              </button>

            </form>

          </div>

        ))}

      </div>

    </div>

  )

}