import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  MODULES,
  type ModuleName,
} from "@/shared/constants/modules"


async function savePermissions(
  formData: FormData
) {
  "use server"


   const roleId =
  formData.get("roleId") as string

if (!roleId) {
  throw new Error("Role not found")
}


  for (const module of MODULES) {

    await prisma.rolePermission.upsert({
  where: {
    roleId_module: {
      roleId,
      module
    }
  },

  update: {
    canView: formData.get(`${module}-view`) === "on",
    canCreate: formData.get(`${module}-create`) === "on",
    canEdit: formData.get(`${module}-edit`) === "on",
    canDelete: formData.get(`${module}-delete`) === "on",
  },

  create: {
    roleId,
    module,

    canView: formData.get(`${module}-view`) === "on",
    canCreate: formData.get(`${module}-create`) === "on",
    canEdit: formData.get(`${module}-edit`) === "on",
    canDelete: formData.get(`${module}-delete`) === "on",
  }
})
  }

  revalidatePath("/settings/roles")

  redirect(
  `/settings/roles?saved=1`
)
}

export default async function EditRolePage({
  searchParams
}:{
  searchParams: Promise<{
    role?: string
  }>
}) {

  const params =
    await searchParams

  const role =
    params.role || "sales"



 const organizationRole =
  await prisma.organizationRole.findUnique({
    where: {
      id: role,
    },
  })

if (!organizationRole) {
  redirect("/settings/roles")
}

const permissions =
  await prisma.rolePermission.findMany({
    where: {
      roleId: organizationRole.id
    }
  })

 const getPermission = (
  module: ModuleName
) => {

  return permissions.find(
   p => p.module === String(module)
  )

}

  return (

    <div className="space-y-8">

      <div className="flex items-center gap-4">

  <Link
    href="/settings/roles"
    className="
    px-4
    py-2
    border
    rounded-xl
    hover:bg-slate-50
    "
  >
    ← Back
  </Link>

  

</div>

      <div>

        <h1 className="text-4xl font-bold">
          Edit Role Permissions
        </h1>

        <p className="text-slate-500 mt-2">
          Configure access control
        </p>

      </div>

      <form
        action={savePermissions}
        className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        "
      >

<input
  type="hidden"
  name="roleId"
  value={organizationRole.id}
/>
        <div className="p-6 border-b">

          <label className="block mb-2 font-medium">
            Role
          </label>

     <div className="rounded-xl border bg-slate-50 px-4 py-3">
  
<div className="rounded-2xl border bg-slate-50 p-5">

  <p className="text-sm text-slate-500">
    Editing Role
  </p>

  <h2 className="text-2xl font-bold mt-1">
    {organizationRole.name}
  </h2>

  {organizationRole.description && (
    <p className="text-slate-500 mt-2">
      {organizationRole.description}
    </p>
  )}

</div>

</div>

        </div>

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Module
              </th>

              <th className="p-4 text-center">
                View
              </th>

              <th className="p-4 text-center">
                Create
              </th>

              <th className="p-4 text-center">
                Edit
              </th>

              <th className="p-4 text-center">
                Delete
              </th>

            </tr>

          </thead>

          <tbody>

            {MODULES.map(module => {

              const p =
                getPermission(module)

              return (

                <tr
                  key={module}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {module}
                  </td>

                  <td className="text-center">

                    <input
                      type="checkbox"
                      name={`${module}-view`}
                      defaultChecked={
                        p?.canView
                      }
                      className="
                      w-5
                      h-5
                      "
                    />

                  </td>

                  <td className="text-center">

                    <input
                      type="checkbox"
                      name={`${module}-create`}
                      defaultChecked={
                        p?.canCreate
                      }
                      className="
                      w-5
                      h-5
                      "
                    />

                  </td>

                  <td className="text-center">

                    <input
                      type="checkbox"
                      name={`${module}-edit`}
                      defaultChecked={
                        p?.canEdit
                      }
                      className="
                      w-5
                      h-5
                      "
                    />

                  </td>

                  <td className="text-center">

                    <input
                      type="checkbox"
                      name={`${module}-delete`}
                      defaultChecked={
                        p?.canDelete
                      }
                      className="
                      w-5
                      h-5
                      "
                    />

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

       <div className="p-6 border-t flex gap-3">

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
    Save Permissions
  </button>

  <Link
    href="/settings/roles"
    className="
    px-6
    py-3
    border
    rounded-xl
    font-medium
    hover:bg-slate-50
    "
  >
    Cancel
  </Link>

</div>

      </form>

    </div>

  )

}