import Link from "next/link"
import prisma from "@/shared/lib/prisma"

export default async function RolesPage() {

  const permissions =
    await prisma.rolePermission.findMany()

  const users =
    await prisma.user.findMany()

  const roles = [
    {
      key:"owner",
      title:"Owner",
      description:"Full Access"
    },
    {
      key:"admin",
      title:"Admin",
      description:"Organization Admin"
    },
    {
      key:"manager",
      title:"Manager",
      description:"Operations Manager"
    },
    {
      key:"sales",
      title:"Sales",
      description:"CRM Sales"
    },
    {
      key:"technician",
      title:"Technician",
      description:"Field User"
    },
    {
      key:"support",
      title:"Support",
      description:"Customer Support"
    },
    {
      key:"accountant",
      title:"Accountant",
      description:"Finance Access"
    }
  ]

  const totalRoles =
    roles.length

  const activePermissions =
    permissions.length

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Roles & Permissions
          </h1>

          <p className="text-slate-500 mt-2">
            Manage CRM access and permissions
          </p>

        </div>

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white border rounded-3xl p-6">
          <p>Total Roles</p>
          <h2 className="text-4xl font-bold">
            {totalRoles}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p>Users</p>
          <h2 className="text-4xl font-bold">
            {users.length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p>Permissions</p>
          <h2 className="text-4xl font-bold">
            {activePermissions}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p>Protected Roles</p>
          <h2 className="text-4xl font-bold">
            2
          </h2>
        </div>

      </div>

      {/* Roles */}

      <div className="grid grid-cols-4 gap-6">

        {roles.map(role => {

          const count =
            users.filter(
              u => u.role === role.key
            ).length

          return (

            <div
              key={role.key}
              className="
              bg-white
              border
              rounded-3xl
              p-6
              "
            >

              <h3 className="text-xl font-bold">
                {role.title}
              </h3>

              <p className="text-slate-500 mt-2">
                {role.description}
              </p>

              <p className="mt-4 text-sm">
                {count} users
              </p>

              <Link
                href={`/settings/roles/edit?role=${role.key}`}
                className="
                inline-block
                mt-4
                px-4
                py-2
                rounded-xl
                bg-orange-600
                text-white
                "
              >
                Edit
              </Link>

            </div>

          )

        })}

      </div>

      {/* Matrix */}

      <div className="bg-white border rounded-3xl">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Permission Matrix
          </h2>

        </div>

        <div className="p-6">

          <table className="w-full">

            <thead>

              <tr>

                <th className="text-left p-3">
                  Module
                </th>

                <th className="p-3">
                  Records
                </th>

                <th className="p-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {[
                "Leads",
                "Customers",
                "Quotes",
                "Jobs",
                "Crew",
                "Billing",
                "Reports",
                "Users"
              ].map(module => (

                <tr
                  key={module}
                  className="border-t"
                >

                  <td className="p-4">
                    {module}
                  </td>

                  <td className="p-4">
                    {
                      permissions.filter(
                        p =>
                          p.module === module
                      ).length
                    }
                  </td>

                  <td className="p-4">

                    <Link
                      href={`/settings/roles/edit?module=${module}`}
                      className="
                      text-orange-600
                      "
                    >
                      Configure
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}