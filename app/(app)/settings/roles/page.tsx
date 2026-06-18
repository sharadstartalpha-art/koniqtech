import prisma from "@/shared/lib/prisma"

export default async function RolesPage() {

  const permissions =
    await prisma.rolePermission.findMany({

      orderBy: [
        {
          role: "asc"
        },
        {
          module: "asc"
        }
      ]

    })

  const roles = [
    {
      name: "owner",
      title: "Owner",
      description: "Full Access"
    },
    {
      name: "admin",
      title: "Admin",
      description: "Organization Admin"
    },
    {
      name: "sales",
      title: "Sales",
      description: "CRM Sales"
    },
    {
      name: "technician",
      title: "Technician",
      description: "Field User"
    }
  ]

  const modules = [

    "Leads",
    "Quotes",
    "Jobs",
    "Crew",
    "Billing",
    "Users",
    "Reports"

  ]

  function hasPermission(
    role: string,
    module: string,
    permission: keyof {
      canView: boolean
      canCreate: boolean
      canEdit: boolean
      canDelete: boolean
    }
  ) {

    const row =
      permissions.find(

        p =>
          p.role === role &&
          p.module === module

      )

    return row?.[permission]
  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Roles & Permissions
        </h1>

        <p className="text-slate-500 mt-2">
          Manage CRM access and permissions
        </p>

      </div>

      {/* Role Cards */}

      <div className="grid grid-cols-4 gap-6">

        {roles.map(role => (

          <div
            key={role.name}
            className="
            bg-white
            border
            rounded-3xl
            p-6
            "
          >

            <h2 className="text-xl font-semibold">
              {role.title}
            </h2>

            <p className="text-slate-500 mt-2">
              {role.description}
            </p>

          </div>

        ))}

      </div>

      {/* Permission Matrix */}

      <div
        className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        "
      >

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Permission Matrix
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-slate-50">

                <th className="p-4 text-left">
                  Permission
                </th>

                <th className="p-4 text-center">
                  Owner
                </th>

                <th className="p-4 text-center">
                  Admin
                </th>

                <th className="p-4 text-center">
                  Sales
                </th>

                <th className="p-4 text-center">
                  Technician
                </th>

              </tr>

            </thead>

            <tbody>

              {modules.map(module => (

                <>
                  <tr
                    key={`${module}-view`}
                    className="border-t"
                  >

                    <td className="p-4">
                      View {module}
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "owner",
                          module,
                          "canView"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "admin",
                          module,
                          "canView"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "sales",
                          module,
                          "canView"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "technician",
                          module,
                          "canView"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                  </tr>

                  <tr
                    key={`${module}-create`}
                    className="border-t"
                  >

                    <td className="p-4">
                      Create {module}
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "owner",
                          module,
                          "canCreate"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "admin",
                          module,
                          "canCreate"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "sales",
                          module,
                          "canCreate"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "technician",
                          module,
                          "canCreate"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                  </tr>

                  <tr
                    key={`${module}-delete`}
                    className="border-t"
                  >

                    <td className="p-4">
                      Delete {module}
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "owner",
                          module,
                          "canDelete"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "admin",
                          module,
                          "canDelete"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "sales",
                          module,
                          "canDelete"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                    <td className="text-center">
                      {
                        hasPermission(
                          "technician",
                          module,
                          "canDelete"
                        )
                          ? "✅"
                          : "❌"
                      }
                    </td>

                  </tr>

                </>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}