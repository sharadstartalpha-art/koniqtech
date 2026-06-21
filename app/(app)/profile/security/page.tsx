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

  if (newPassword.length < 8) {
    redirect(
      "/profile/security?error=Password must be at least 8 characters"
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

  if (!valid) {
    redirect(
      "/profile/security?error=Current password is incorrect"
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

  revalidatePath("/profile/security")

  redirect(
    "/profile/security?success=1"
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

      <div>

        <h1 className="text-4xl font-bold">
          Security
        </h1>

        <p className="text-slate-500 mt-2">
          Manage password and security
        </p>

      </div>

      {searchParams.success && (

        <div
          className="
          p-4
          rounded-xl
          bg-green-100
          text-green-700
          "
        >
          Password updated successfully
        </div>

      )}

      {searchParams.error && (

        <div
          className="
          p-4
          rounded-xl
          bg-red-100
          text-red-700
          "
        >
          {searchParams.error}
        </div>

      )}

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