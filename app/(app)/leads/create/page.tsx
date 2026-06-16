import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

async function createLead(
  formData: FormData
){

  "use server"

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  if(!orgId){
    return
  }

  await prisma.lead.create({

    data:{

      orgId,

      source:String(
        formData.get("source")
      ),

      firstName:String(
        formData.get("firstName")
      ),

      lastName:String(
        formData.get("lastName")
      ),

      email:String(
        formData.get("email")
      ),

      phone:String(
        formData.get("phone")
      ),

      companyName:String(
        formData.get("companyName")
      ),

      address:String(
        formData.get("address")
      ),

      budget:Number(
        formData.get("budget")
      ) || 0,

      priority:String(
        formData.get("priority")
      ),

      tags:String(
        formData.get("tags")
      )

    }

  })

  redirect("/leads")
}

export default async function Page(){

  const users =
    await prisma.user.findMany({

      orderBy:{
        name:"asc"
      }

    })

  return(

    <div className="max-w-6xl mx-auto">

      <div
        className="
        bg-white
        border
        rounded-3xl
        shadow-sm
        p-8
        md:p-10
        "
      >

        <div className="mb-8">

          <h1 className="text-5xl font-bold">
            Create Lead
          </h1>

          <p className="text-slate-500 mt-2">
            Capture and qualify a new sales opportunity.
          </p>

        </div>

        <form
          action={createLead}
          className="space-y-8"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="font-medium block mb-2">
                First Name
              </label>

              <input
                required
                name="firstName"
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

              <label className="font-medium block mb-2">
                Last Name
              </label>

              <input
                name="lastName"
                className="
                w-full
                h-14
                border
                rounded-2xl
                px-4
                "
              />

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="font-medium block mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
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

              <label className="font-medium block mb-2">
                Phone
              </label>

              <input
                name="phone"
                className="
                w-full
                h-14
                border
                rounded-2xl
                px-4
                "
              />

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="font-medium block mb-2">
                Company Name
              </label>

              <input
                name="companyName"
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

              <label className="font-medium block mb-2">
                Lead Source
              </label>

              <select
                name="source"
                className="
                w-full
                h-14
                border
                rounded-2xl
                px-4
                "
              >
                <option>Website</option>
                <option>Facebook</option>
                <option>Google Ads</option>
                <option>Referral</option>
                <option>Walk-in</option>
              </select>

            </div>

          </div>

          <div>

            <label className="font-medium block mb-2">
              Address
            </label>

            <input
              name="address"
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              "
            />

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div>

              <label className="font-medium block mb-2">
                Budget
              </label>

              <input
                type="number"
                name="budget"
                placeholder="5000"
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

              <label className="font-medium block mb-2">
                Priority
              </label>

              <select
                name="priority"
                className="
                w-full
                h-14
                border
                rounded-2xl
                px-4
                "
              >
                <option>Low</option>
                <option selected>
                  Medium
                </option>
                <option>High</option>
              </select>

            </div>

            <div>

              <label className="font-medium block mb-2">
                Assigned Rep
              </label>

              <select
                name="assignedTo"
                className="
                w-full
                h-14
                border
                rounded-2xl
                px-4
                "
              >

                <option value="">
                  Select Rep
                </option>

                {users.map(user=>(

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name}
                  </option>

                ))}

              </select>

            </div>

          </div>

          <div>

            <label className="font-medium block mb-2">
              Tags
            </label>

            <input
              name="tags"
              placeholder="roofing, commercial, urgent"
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

            <label className="font-medium block mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              rows={5}
              className="
              w-full
              border
              rounded-2xl
              p-4
              "
            />

          </div>

          <div>

            <label className="font-medium block mb-2">
              Attachment
            </label>

            <input
              type="file"
              className="
              w-full
              border
              rounded-2xl
              p-3
              "
            />

          </div>

          <div className="flex gap-4">

            <button
              type="submit"
              className="
              px-8
              py-4
              bg-blue-600
              text-white
              rounded-2xl
              font-medium
              "
            >
              Create Lead
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}