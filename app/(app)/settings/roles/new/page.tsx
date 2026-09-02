import Link from "next/link"
import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { MODULES } from "@/shared/constants/modules"

async function createRole(
  formData: FormData
) {
  "use server"

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  if (!orgId) {
    throw new Error("Organization not found")
  }

  const name =
    formData.get("name") as string

  const description =
    formData.get("description") as string

  const active =
    formData.get("active") === "on"

  if (!name) {
    throw new Error("Role name required")
  }

  const existing =
    await prisma.organizationRole.findFirst({
      where: {
        orgId,
        name,
      },
    })

  if (existing) {
    throw new Error("Role already exists")
  }

 const role =
  await prisma.organizationRole.create({
    data: {
      orgId,
      name,
      description,
      active,
    },
  })

await prisma.rolePermission.createMany({
  data: MODULES.map(module => ({
    roleId: role.id,
    module,
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canImport: false,
    canExport: false,
    canApprove: false,
    canAssign: false,
  })),
})

  revalidatePath("/settings/roles")

  redirect(
    `/settings/roles/edit?role=${role.id}`
  )
}

export default function NewRolePage() {

  return (

    <div className="max-w-4xl mx-auto">

      <div className="mb-8">

        <Link
          href="/settings/roles"
          className="
          text-sm
          text-slate-500
          hover:text-slate-900
          "
        >
          ← Back to Roles
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Create Role
        </h1>

        <p className="text-slate-500 mt-2">
          Create a new organization role
        </p>

      </div>

      <form
        action={createRole}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <div>

          <label className="block mb-2 font-medium">
            Role Name
          </label>

          <input
            name="name"
            required
            placeholder="Dispatcher"
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
            Description
          </label>

          <textarea
            name="description"
            rows={4}
            placeholder="Responsible for scheduling and dispatching jobs."
            className="
            w-full
            rounded-xl
            border
            p-4
            "
          />

        </div>

        <div className="flex items-center gap-3">

          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked
          />

          <label htmlFor="active">
            Active
          </label>

        </div>

        <div className="flex gap-3">

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
            Create Role
          </button>

          <Link
            href="/settings/roles"
            className="
            px-6
            py-3
            border
            rounded-xl
            "
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>

  )
}