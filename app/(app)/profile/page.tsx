import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

async function updateProfile(
  formData: FormData
) {
  "use server"

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const name =
    formData.get("name") as string

  const avatar =
    formData.get("avatar") as string

  await prisma.user.update({

    where: {
      id: session.user.id
    },

    data: {
      name,
      avatar
    }

  })

  revalidatePath("/profile")

  redirect("/profile?saved=1")
}

export default async function ProfilePage() {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user =
    await prisma.user.findUnique({

      where: {
        id: session.user.id
      },

      include: {
        organization: true
      }

    })

  if (!user) {
    redirect("/login")
  }

  return (

    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your account information
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Profile Card */}

        <div
          className="
          bg-white
          border
          rounded-3xl
          p-8
          "
        >

          <div className="flex flex-col items-center">

            <div
              className="
              w-28
              h-28
              rounded-full
              bg-orange-600
              text-white
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              "
            >
              {user.name?.charAt(0)}
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {user.name}
            </h2>

            <p className="text-slate-500">
              {user.email}
            </p>

            <span
              className="
              mt-4
              px-4
              py-2
              rounded-full
              bg-blue-100
              text-blue-700
              capitalize
              "
            >
              {user.role}
            </span>

          </div>

        </div>

        {/* Account Details */}

        <div
          className="
          lg:col-span-2
          bg-white
          border
          rounded-3xl
          overflow-hidden
          "
        >

          <div className="p-8 border-b">

            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

          </div>

          <form
            action={updateProfile}
            className="p-8 space-y-6"
          >

            <div>

              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                name="name"
                defaultValue={user.name ?? ""}
                className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <input
                value={user.email}
                disabled
                className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                bg-slate-50
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Avatar URL
              </label>

              <input
                name="avatar"
                defaultValue={user.avatar ?? ""}
                placeholder="https://..."
                className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                "
              />

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-2 font-medium">
                  Role
                </label>

                <input
                  value={user.role}
                  disabled
                  className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  bg-slate-50
                  capitalize
                  "
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Status
                </label>

                <input
                  value={user.status}
                  disabled
                  className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  bg-slate-50
                  capitalize
                  "
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Organization
              </label>

              <input
                value={
                  user.organization?.name ??
                  "N/A"
                }
                disabled
                className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                bg-slate-50
                "
              />

            </div>

            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                className="
                px-6
                py-3
                bg-orange-600
                text-white
                rounded-xl
                font-medium
                hover:bg-orange-700
                "
              >
                Save Changes
              </button>

              <Link
                href="/profile/security"
                className="
                px-6
                py-3
                border
                rounded-xl
                font-medium
                hover:bg-slate-50
                "
              >
                Change Password
              </Link>

            </div>

          </form>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div
          className="
          bg-white
          border
          rounded-3xl
          p-6
          "
        >

          <p className="text-slate-500 text-sm">
            Account Created
          </p>

          <h3 className="text-xl font-bold mt-2">
            {new Date(
              user.createdAt
            ).toLocaleDateString()}
          </h3>

        </div>

        <div
          className="
          bg-white
          border
          rounded-3xl
          p-6
          "
        >

          <p className="text-slate-500 text-sm">
            Role
          </p>

          <h3 className="text-xl font-bold mt-2 capitalize">
            {user.role}
          </h3>

        </div>

        <div
          className="
          bg-white
          border
          rounded-3xl
          p-6
          "
        >

          <p className="text-slate-500 text-sm">
            Status
          </p>

          <h3 className="text-xl font-bold mt-2 capitalize">
            {user.status}
          </h3>

        </div>

      </div>

    </div>

  )
}