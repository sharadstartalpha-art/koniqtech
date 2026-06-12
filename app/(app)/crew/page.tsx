import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page(){

  const crew =
    await prisma.crewMember.findMany({

      orderBy:{
        createdAt:"desc"
      }

    })

  async function createCrew(
    formData:FormData
  ){

    "use server"

    await prisma.crewMember.create({

      data:{

        orgId:"YOUR_ORG_ID",

        name:String(
          formData.get("name")
        ),

        phone:String(
          formData.get("phone")
        ),

        email:String(
          formData.get("email")
        ),

        role:String(
          formData.get("role")
        )

      }

    })

    revalidatePath("/crew")
  }

  return(

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
        p-8
        space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Add Crew Member
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
          name="email"
          placeholder="Email"
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
          Save Crew Member
        </button>

      </form>

      <div className="space-y-4">

        {crew.map(member=>(

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
              {member.name}
            </div>

            <div className="text-slate-500">
              {member.role}
            </div>

            <div className="text-sm mt-1">
              {member.phone}
            </div>

          </div>

        ))}

      </div>

    </div>

  )

}