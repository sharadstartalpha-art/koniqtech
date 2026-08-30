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
  formData: FormData
) {

  "use server"

  const name =
    String(formData.get("name")).trim()

  const password =
    String(formData.get("password"))

  const confirmPassword =
    String(formData.get("confirmPassword"))

  if (!name) {
    throw new Error("Name is required.")
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.")
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.")
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: validInvitation.email,
      },
    })

  if (existingUser) {
    throw new Error("This account already exists.")
  }

  const orgRole =
    await prisma.organizationRole.findUnique({
      where: {
        id: validInvitation.roleId,
      },
    })

  if (!orgRole) {
    throw new Error("Role not found.")
  }

  // <-- THIS WAS MISSING
  const hash = await bcrypt.hash(password, 10)

  await prisma.$transaction(async (tx) => {

    await tx.user.create({
      data: {
        orgId: validInvitation.orgId,
        name,
        email: validInvitation.email,
        passwordHash: hash,
        organizationRoleId: validInvitation.roleId,
        status: "active",
        emailVerified: true,
      },
    })

    await tx.teamInvitation.update({
      where: {
        id: validInvitation.id,
      },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    })

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
  You're accepting an invitation for
</p>

<p className="font-medium">
  {invitation.email}
</p>

       <input
  name="name"
  required
  defaultValue={invitation.name ?? ""}
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

<input
  name="confirmPassword"
  type="password"
  required
  placeholder="Confirm Password"
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