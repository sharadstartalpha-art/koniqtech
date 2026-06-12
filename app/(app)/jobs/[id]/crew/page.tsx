import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params: Promise<{id:string}>
}) {

  const { id } = await params

  const crew = await prisma.crewAssignment.findMany({

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

  async function createCrew(
    formData: FormData
  ){

    "use server"

    const member =
      await prisma.crewMember.create({

        data:{
          orgId:"TEMP_ORG_ID", // replace later
          name:String(formData.get("name")),
          phone:String(formData.get("phone") || ""),
          role:String(formData.get("role"))
        }

      })

    await prisma.crewAssignment.create({

      data:{
        jobId:id,
        crewId:member.id
      }

    })

    revalidatePath(`/jobs/${id}/crew`)
  }

  return (

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Crew
      </h1>

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
          required
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

        <select
          name="role"
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        >
          <option value="technician">
            Technician
          </option>

          <option value="helper">
            Helper
          </option>

          <option value="supervisor">
            Supervisor
          </option>

          <option value="subcontractor">
            Subcontractor
          </option>
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
          Save Crew Member
        </button>

      </form>

      <div className="space-y-4">

        {crew.length === 0 && (

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

       {crew.map(member => (

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
      {member.crew.name}
    </div>

    <div className="text-slate-500">
      {member.crew.role}
    </div>

    {member.crew.phone && (

      <div className="text-sm mt-1">
        {member.crew.phone}
      </div>

    )}

  </div>

))}

      </div>

    </div>

  )
}