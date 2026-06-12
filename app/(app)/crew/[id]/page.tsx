import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export default async function Page({
  params
}:{
  params: Promise<{id:string}>
}){

  const { id } = await params

  const member =
    await prisma.crewMember.findUnique({
      where:{
        id
      }
    })

  if(!member){
    notFound()
  }

  async function updateCrew(
    formData:FormData
  ){

    "use server"

    await prisma.crewMember.update({

      where:{
        id
      },

      data:{

        name:String(
          formData.get("name")
        ),

        phone:String(
          formData.get("phone") || ""
        ),

        email:String(
          formData.get("email") || ""
        ),

        role:String(
          formData.get("role")
        )

      }

    })

    revalidatePath("/crew")

    redirect("/crew")
  }

  return(

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <h1 className="text-5xl font-bold">
          Edit Crew Member
        </h1>

        <Link
          href="/crew"
          className="
          px-5
          py-3
          border
          rounded-2xl
          "
        >
          Back
        </Link>

      </div>

      <form
        action={updateCrew}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-5
        max-w-3xl
        "
      >

        <div>

          <label className="block mb-2 font-medium">
            Name
          </label>

          <input
            name="name"
            defaultValue={member.name}
            required
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Phone
          </label>

          <input
            name="phone"
            defaultValue={member.phone || ""}
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            name="email"
            type="email"
            defaultValue={member.email || ""}
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Role
          </label>

          <select
            name="role"
            defaultValue={member.role}
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

        </div>

        <button
          type="submit"
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Save Changes
        </button>

      </form>

    </div>

  )

}