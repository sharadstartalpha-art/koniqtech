import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { resend } from "@/shared/lib/resend"

export default async function Page() {

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  const invitations =
    await prisma.teamInvitation.findMany({

      where:{
        orgId
      },

      orderBy:{
        createdAt:"desc"
      }

    })

  async function sendInvite(
    formData:FormData
  ){

    "use server"

    const session =
      await auth()

    const orgId =
      (session?.user as any)?.orgId

    if(!orgId) return

    const email =
      String(formData.get("email"))

    const role =
      formData.get("role") as any

    const token =
      randomUUID()

      const existingUser =
  await prisma.user.findUnique({

    where:{
      email
    }

  })

if(existingUser){

  throw new Error(
    "User already exists"
  )
}

const existingInvite =
  await prisma.teamInvitation.findFirst({

    where:{
      email,
      status:"pending"
    }

  })

if(existingInvite){

  throw new Error(
    "Invitation already sent"
  )

}

    await prisma.teamInvitation.create({

      data:{

        orgId,

        email,

        role,

        token,

         expiresAt:new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )

      }

    })

    // TODO:
    // Send Resend email

await resend.emails.send({

  from:
    "KoniqTech <otp@koniqtech.com>",

  to:[email],

  subject:
    "Join KoniqTech CRM",

  html:`

    <div style="font-family:Arial">

      <h2>
        You have been invited
        to join KoniqTech CRM
      </h2>

      <p>
        Role:
        <strong>${role}</strong>
      </p>

      <p>
        Click below to accept:
      </p>

      <a
        href="https://koniqtech.com/invite/${token}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#f97316;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Accept Invitation
      </a>

    </div>

  `
})



    revalidatePath(
      "/settings/invitations"
    )
  }

  async function cancelInvite(
    id:string
  ){

    "use server"

    await prisma.teamInvitation.delete({

      where:{ id }

    })

    revalidatePath(
      "/settings/invitations"
    )
  }

  const pending =
    invitations.filter(
      x => x.status === "pending"
    )

  const accepted =
    invitations.filter(
      x => x.status === "accepted"
    )

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Team Invitations
        </h1>

        <p className="text-slate-500 mt-2">
          Invite staff members to organization
        </p>

      </div>

      {/* Invite Form */}

      <form
        action={sendInvite}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        "
      >

        <h2 className="text-xl font-semibold mb-6">
          Send Invitation
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            name="email"
            type="email"
            required
            placeholder="john@gmail.com"
            className="
            h-12
            border
            rounded-xl
            px-4
            "
          />

          <select
            name="role"
            className="
            h-12
            border
            rounded-xl
            px-4
            "
          >

            <option value="owner">
              Owner
            </option>

            <option value="admin">
              Admin
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="sales">
              Sales
            </option>

            <option value="support">
              Support
            </option>

            <option value="accountant">
              Accountant
            </option>

            <option value="technician">
              Technician
            </option>

          </select>

          <button
            className="
            h-12
            bg-orange-600
            text-white
            rounded-xl
            "
          >
            Send Invite
          </button>

        </div>

      </form>

      {/* Pending */}

      <div className="
      bg-white
      border
      rounded-3xl
      overflow-hidden
      ">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Pending Invitations
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Sent
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {pending.map(inv => (

              <tr
                key={inv.id}
                className="border-t"
              >

                <td className="p-4">
                  {inv.email}
                </td>

                <td className="p-4 capitalize">
                  {inv.role}
                </td>

                <td className="p-4">
                  {inv.createdAt.toLocaleDateString()}
                </td>

                <td className="p-4">

                  <span className="
                  px-3
                  py-1
                  rounded-full
                  bg-yellow-100
                  text-yellow-700
                  text-sm
                  ">

                    Pending

                  </span>

                </td>

                <td className="p-4">

                  <form
                    action={
                      cancelInvite.bind(
                        null,
                        inv.id
                      )
                    }
                  >

                    <button
                      className="
                      text-red-600
                      "
                    >
                      Cancel
                    </button>

                  </form>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Accepted */}

      <div className="
      bg-white
      border
      rounded-3xl
      overflow-hidden
      ">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Accepted Invitations
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {accepted.map(inv => (

              <tr
                key={inv.id}
                className="border-t"
              >

                <td className="p-4">
                  {inv.email}
                </td>

                <td className="p-4 capitalize">
                  {inv.role}
                </td>

                <td className="p-4">
                  {
                    inv.acceptedAt
                    ?.toLocaleDateString()
                  }
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}