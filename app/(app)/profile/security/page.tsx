import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function updatePassword(
  formData: FormData
) {
  "use server"

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const currentPassword =
    formData.get("currentPassword") as string

  const newPassword =
    formData.get("newPassword") as string

  const confirmPassword =
    formData.get("confirmPassword") as string

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  if (newPassword.length < 8) {
    throw new Error(
      "Password must be at least 8 characters"
    )
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })

  if (!user) {
    throw new Error("User not found")
  }

  const valid =
    await bcrypt.compare(
      currentPassword,
      user.passwordHash
    )

  if (!valid) {
    throw new Error("Current password invalid")
  }

  const passwordHash =
    await bcrypt.hash(
      newPassword,
      10
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
    "/profile/security?saved=1"
  )
}

export default async function SecurityPage() {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const sessions =
    await prisma.session.count({
      where: {
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

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-semibold mb-6">
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
            className="w-full h-12 px-4 border rounded-xl"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            required
            className="w-full h-12 px-4 border rounded-xl"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full h-12 px-4 border rounded-xl"
          />

          <button
            type="submit"
            className="
            px-6 py-3
            bg-orange-600
            text-white
            rounded-xl
            "
          >
            Update Password
          </button>

        </form>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="font-semibold text-lg">
          Active Sessions
        </h2>

        <p className="text-4xl font-bold mt-4">
          {sessions}
        </p>

      </div>

    </div>

  )
}