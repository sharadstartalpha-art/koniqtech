import prisma from "@/shared/lib/prisma"

export default async function TeamPage() {

  const orgId = "CURRENT_ORG_ID"

  const users =
    await prisma.user.findMany({

      where:{
        orgId
      },

      orderBy:{
        createdAt:"desc"
      }

    })

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Team Members
        </h1>

        <p className="text-slate-500">
          Manage organization users
        </p>

      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map(user=>(

              <tr
                key={user.id}
                className="border-t"
              >

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4 capitalize">
                  {user.role}
                </td>

                <td className="p-4">

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-green-100
                    text-green-700
                    text-sm
                    "
                  >
                    {user.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}