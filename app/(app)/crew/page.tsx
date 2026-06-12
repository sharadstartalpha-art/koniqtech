import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page() {

  const crew =
    await prisma.crewMember.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

  async function createCrew(
    formData: FormData
  ) {

    "use server"

    const user =
      await prisma.user.findFirst()

    if (!user) return

    await prisma.crewMember.create({

      data: {

        orgId: user.orgId,

        name: String(
          formData.get("name")
        ),

        phone: String(
          formData.get("phone") || ""
        ),

        email: String(
          formData.get("email") || ""
        ),

        role: String(
          formData.get("role")
        )

      }

    })

    revalidatePath("/crew")

  }

  async function deleteCrew(
    formData: FormData
  ) {

    "use server"

    const id =
      String(
        formData.get("id")
      )

    await prisma.crewMember.delete({
      where: {
        id
      }
    })

    revalidatePath("/crew")

  }

  return (

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Crew
      </h1>

      <form
        action={createCrew}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Add Crew Member
        </h2>

        <input
          name="name"
          required
          placeholder="Name"
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        />

        <input
          name="phone"
          placeholder="Phone"
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        />

        <input
          name="email"
          placeholder="Email"
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        />

        <select
          name="role"
          className="
          w-full
          h-14
          border
          rounded-2xl
          px-4
          "
        >

          <option value="technician">
            Technician
          </option>

          <option value="helper">
            Helper
          </option>

          <option value="supervisor">
            Supervisor
          </option>

        </select>

        <button
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Save Crew Member
        </button>

      </form>

      <div
        className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50 border-b">

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {crew.map(member => (

              <tr
                key={member.id}
                className="border-b"
              >

                <td className="p-4">
                  {member.name}
                </td>

                <td className="p-4 capitalize">
                  {member.role}
                </td>

                <td className="p-4">
                  {member.phone}
                </td>

                <td className="p-4">
                  {member.email}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/crew/${member.id}`}
                      className="
                      px-3
                      py-2
                      bg-slate-100
                      rounded-xl
                      "
                    >
                      Edit
                    </Link>

                    <form action={deleteCrew}>

                      <input
                        type="hidden"
                        name="id"
                        value={member.id}
                      />

                      <button
                        className="
                        px-3
                        py-2
                        bg-red-600
                        text-white
                        rounded-xl
                        "
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </td>

              </tr>

            ))}

            {crew.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                  p-8
                  text-center
                  text-slate-500
                  "
                >
                  No crew members found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}