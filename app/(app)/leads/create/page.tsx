import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

async function createLead(formData: FormData) {

  "use server"

  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if (!orgId) return

  await prisma.lead.create({

    data: {

      orgId,

      firstName:
        String(formData.get("firstName")),

      lastName:
        String(formData.get("lastName")),

      email:
        String(formData.get("email")),

      phone:
        String(formData.get("phone")),

      status: "new"

    }

  })

  redirect("/leads")

}

export default function Page() {

  return (

    <form
      action={createLead}
      className="space-y-4 max-w-xl"
    >

      <h1 className="text-5xl font-bold">
        Create Lead
      </h1>

      <input
        name="firstName"
        placeholder="First name"
        className="border p-4 w-full rounded-xl"
      />

      <input
        name="lastName"
        placeholder="Last name"
        className="border p-4 w-full rounded-xl"
      />

      <input
        name="email"
        placeholder="Email"
        className="border p-4 w-full rounded-xl"
      />

      <input
        name="phone"
        placeholder="Phone"
        className="border p-4 w-full rounded-xl"
      />

      <button className="bg-black text-white px-8 py-4 rounded-xl">

        Save

      </button>

    </form>

  )

}