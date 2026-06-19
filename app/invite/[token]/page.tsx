import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export default async function Page({
  params
}:{
  params:Promise<{
    token:string
  }>
}){

  const { token } =
    await params

  const invitation =
    await prisma.teamInvitation.findUnique({

      where:{
        token
      }

    })


    
  if(
    !invitation ||
    invitation.status === "accepted" ||
    invitation.expiresAt < new Date()
  ){
    notFound()
  }

  const validInvitation = invitation

  async function acceptInvite(
    formData:FormData
  ){

    "use server"

    const name =
      String(formData.get("name"))

    const password =
      String(formData.get("password"))

    const hash =
      await bcrypt.hash(
        password,
        10
      )

    await prisma.user.create({

      data:{

        orgId:
          validInvitation.orgId,

        name,

        email:
          validInvitation.email,

        passwordHash:
          hash,

        role:
          validInvitation.role

      }

    })

    await prisma.teamInvitation.update({

      where:{
        id:validInvitation.id
      },

      data:{

        status:"accepted",

        acceptedAt:
          new Date()

      }

    })

    redirect("/login?registered=1")
  }

  return(

    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-slate-50
    ">

      <form
        action={acceptInvite}
        className="
        w-full
        max-w-md
        bg-white
        border
        rounded-3xl
        p-8
        space-y-4
        "
      >

        <h1 className="text-3xl font-bold">
          Accept Invitation
        </h1>

        <p className="text-slate-500">
          {invitation.email}
        </p>

        <input
          name="name"
          required
          placeholder="Full Name"
          className="
          w-full
          h-12
          border
          rounded-xl
          px-4
          "
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="
          w-full
          h-12
          border
          rounded-xl
          px-4
          "
        />

        <button
          className="
          w-full
          h-12
          bg-orange-600
          text-white
          rounded-xl
          "
        >
          Create Account
        </button>

      </form>

    </div>

  )

}