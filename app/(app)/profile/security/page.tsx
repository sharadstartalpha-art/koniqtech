import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import SecurityToast from "./SecurityToast"

async function updatePassword(
  formData: FormData
) {
  "use server"

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const currentPassword =
    String(formData.get("currentPassword") || "")

  const newPassword =
    String(formData.get("newPassword") || "")

  const confirmPassword =
    String(formData.get("confirmPassword") || "")

    

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    redirect(
      "/profile/security?error=All fields are required"
    )
  }

  if (newPassword !== confirmPassword) {
    redirect(
      "/profile/security?error=Passwords do not match"
    )
  }

  if (
  newPassword.length < 8 ||
  !/[A-Z]/.test(newPassword) ||
  !/[a-z]/.test(newPassword) ||
  !/[0-9]/.test(newPassword)
) {

  redirect(
    "/profile/security?error=Password must contain uppercase, lowercase and number"
  )

}

  const user =
    await prisma.user.findUnique({

      where: {
        id: session.user.id
      }

    })

  if (!user) {
    redirect(
      "/profile/security?error=User not found"
    )
  }

 

  
const valid =
await bcrypt.compare(
currentPassword,
user.passwordHash
)

if(!valid){

redirect(
"/profile/security?error=Current password is incorrect"
)

}

const samePassword =
await bcrypt.compare(
newPassword,
user.passwordHash
)

if(samePassword){

redirect(
"/profile/security?error=New password must be different from current password"
)

}

const passwordHash =
await bcrypt.hash(
newPassword,
12
)


await prisma.user.update({

    where: {
      id: user.id
    },

    data: {
      passwordHash
    }

  })


await prisma.auditLog.create({

data:{

orgId:user.orgId,

userId:user.id,

action:"PASSWORD_UPDATED",

entity:"User",

entityId:user.id

}

})

await prisma.session.deleteMany({

where:{
userId:user.id
}

})
  

  if (samePassword) {

  redirect(
    "/profile/security?error=New password must be different from current password"
  )

}

  revalidatePath("/profile/security")

 redirect(
  "/profile/security?success=Password updated successfully"
)
}



export default async function SecurityPage({
  searchParams
}:{
  searchParams:{
    success?:string
    error?:string
  }
}) {

  const params = searchParams
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const sessions =
    await prisma.session.count({

      where:{
        userId: session.user.id
      }

    })

  return (

    <div className="max-w-4xl mx-auto space-y-8">

     <SecurityToast
  error={params.error}
  success={params.success}
/>

      <div>

        <h1 className="text-4xl font-bold">
          Security
        </h1>

        <p className="text-slate-500 mt-2">
          Manage password and security
        </p>

      </div>

     

     

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-8
        "
      >

        <h2
          className="
          text-xl
          font-semibold
          mb-6
          "
        >
          Change Password
        </h2>

        <form
          action={updatePassword}
          className="space-y-6"
        >

          <input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            placeholder="Current Password"
            required
            className="
            w-full
            h-12
            px-4
            border
            rounded-xl
            "
          />

          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="New Password"
            required
            minLength={8}
            className="
            w-full
            h-12
            px-4
            border
            rounded-xl
            "
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            minLength={8}
            className="
            w-full
            h-12
            px-4
            border
            rounded-xl
            "
          />

          <button
            type="submit"
            className="
            px-6
            py-3
            bg-orange-600
            text-white
            rounded-xl
            hover:bg-orange-700
            "
          >
            Update Password
          </button>

        </form>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-8
        "
      >

        <h2
          className="
          text-lg
          font-semibold
          "
        >
          Active Sessions
        </h2>

        <p
          className="
          text-4xl
          font-bold
          mt-4
          "
        >
          {sessions}
        </p>

      </div>

    </div>

  )

  
}