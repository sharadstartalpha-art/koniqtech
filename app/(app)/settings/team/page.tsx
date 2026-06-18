import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import DeleteUserButton from "./DeleteUserButton"

export default async function TeamPage() {

  const session = await auth()

  if (!session?.user?.orgId) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  const users = await prisma.user.findMany({
    where: {
      orgId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

async function toggleUserStatus(
  formData: FormData
){
  "use server"

  const id =
    formData.get("id") as string

  const status =
    formData.get("status") as string

  await prisma.user.update({

    where:{
      id
    },

    data:{
      status
    }

  })

  revalidatePath(
    "/settings/team"
  )
}

async function deleteUser(
  formData: FormData
){
  "use server"

  const id =
    formData.get("id") as string

  const user =
    await prisma.user.findUnique({

      where:{ id }

    })

  if(
    user?.role === "owner"
  ){
    throw new Error(
      "Owner cannot be deleted"
    )
  }

  await prisma.user.delete({

    where:{
      id
    }

  })

  revalidatePath(
    "/settings/team"
  )
}


  const totalUsers = users.length

  const activeUsers = users.filter(
    user => user.status === "active"
  ).length

  const admins = users.filter(
    user =>
      user.role === "admin" ||
      user.role === "owner"
  ).length

  const salesReps = users.filter(
    user => user.role === "sales"
  ).length

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Team Members
          </h1>

          <p className="text-slate-500 mt-1">
            Manage organization users and permissions
          </p>

        </div>

        <Link
          href="/settings/team/new"
          className="
          px-5
          py-3
          bg-orange-600
          text-white
          rounded-2xl
          font-medium
          "
        >
          + Add Team Member
        </Link>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Total Users
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Active Users
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {activeUsers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Admins
          </p>

          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {admins}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Sales Reps
          </p>

          <h2 className="text-4xl font-bold mt-2 text-orange-600">
            {salesReps}
          </h2>
        </div>

      </div>

      {/* Team Table */}

      <div className="bg-white rounded-3xl border overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="font-semibold text-lg">
            Team Directory
          </h2>

        </div>

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

              <th className="p-4 text-left">
                Joined
              </th>

              <th className="p-4 text-left">
                Actions
             </th>

            </tr>

          </thead>

          <tbody>

            {users.map(user => (

              <tr
                key={user.id}
                className="border-t"
              >

                <td className="p-4 font-medium">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-blue-100
                    text-blue-700
                    text-sm
                    capitalize
                    "
                  >
                    {user.role}
                  </span>

                </td>

                <td className="p-4">

                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm

                    ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                    `}
                  >
                    {user.status}
                  </span>

                </td>

                <td className="p-4 text-slate-500">

                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}

                </td>
                
                <td className="p-4">

  <div className="flex gap-2">

    <Link
      href={`/settings/team/${user.id}/edit`}
      className="
      px-3
      py-1
      text-sm
      rounded-lg
      bg-blue-100
      text-blue-700
      "
    >
      Edit
    </Link>

    <form
      action={toggleUserStatus}
    >
      <input
        type="hidden"
        name="id"
        value={user.id}
      />

      <input
        type="hidden"
        name="status"
        value={
          user.status === "active"
            ? "inactive"
            : "active"
        }
      />

      <button
        className={`
        px-3
        py-1
        text-sm
        rounded-lg

        ${
          user.status === "active"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }
        `}
      >
        {
          user.status === "active"
            ? "Deactivate"
            : "Activate"
        }
      </button>

    </form>

    {user.role !== "owner" && (

      <form action={deleteUser}>

  <input
    type="hidden"
    name="id"
    value={user.id}
  />

  <DeleteUserButton
    id={user.id}
    action={deleteUser}
  />

</form>

    )}

  </div>

</td>






              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}