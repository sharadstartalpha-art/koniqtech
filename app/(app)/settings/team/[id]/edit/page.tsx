import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditTeamMemberPage({
  params
}: Props) {

  const { id } = await params

  const user =
    await prisma.user.findUnique({

      where: {
        id
      }

    })

  if (!user) {
    notFound()
  }

  async function updateUser(
    formData: FormData
  ) {
    "use server"

    const id =
      formData.get("id") as string

    const name =
      formData.get("name") as string

    const email =
      formData.get("email") as string

    const role =
      formData.get("role") as any

    const status =
      formData.get("status") as string

    await prisma.user.update({

      where: {
        id
      },

      data: {
        name,
        email,
        role,
        status
      }

    })

    revalidatePath(
      "/settings/team"
    )

    redirect(
      "/settings/team"
    )
  }

  return (

    <div className="max-w-4xl mx-auto">

      <div className="mb-8">

        <Link
          href="/settings/team"
          className="
          text-sm
          text-slate-500
          hover:text-slate-900
          "
        >
          ← Back to Team
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Edit Team Member
        </h1>

        <p className="text-slate-500 mt-2">
          Update user details and permissions
        </p>

      </div>

      <form
        action={updateUser}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <input
          type="hidden"
          name="id"
          value={user.id}
        />

        <div>

          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            name="name"
            defaultValue={user.name}
            required
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
            type="email"
            name="email"
            defaultValue={user.email}
            required
            className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            "
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              name="role"
              defaultValue={user.role}
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
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

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue={user.status}
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              "
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>

        </div>

        <div className="pt-4 flex gap-3">

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
            href="/settings/team"
            className="
            px-6
            py-3
            border
            rounded-xl
            font-medium
            "
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>

  )
}