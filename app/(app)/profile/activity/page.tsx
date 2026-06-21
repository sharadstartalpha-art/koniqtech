import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ActivityPage() {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const messages =
    await prisma.message.findMany({

      where: {
        senderId: session.user.id
      },

      orderBy: {
        createdAt: "desc"
      },

      take: 20

    })

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Activity
        </h1>

        <p className="text-slate-500 mt-2">
          Recent account activity
        </p>

      </div>

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

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Activity
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {messages.map(message => (

              <tr
                key={message.id}
                className="border-t"
              >

                <td className="p-4">
                  Sent Message
                </td>

                <td className="p-4">
                  {new Date(
                    message.createdAt
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

            {messages.length === 0 && (

              <tr>

                <td
                  colSpan={2}
                  className="
                  p-10
                  text-center
                  text-slate-500
                  "
                >
                  No activity found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )
}