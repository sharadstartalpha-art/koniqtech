import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } = await params

  const customer =
    await prisma.customer.findFirst({

      where: {
        id,
        orgId
      },

      include: {

        CustomerFile: {

          orderBy: {
            createdAt: "desc"
          }

        }

      }

    })

  if (!customer) {
    notFound()
  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href={`/customers/${customer.id}`}
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Customer
          </Link>

          <h1 className="text-4xl font-bold mt-3">
            Customer Files
          </h1>

          <p className="text-slate-500 mt-2">
            Upload and manage customer documents.
          </p>

        </div>

        <Link
          href={`/customers/${customer.id}/files/upload`}
          className="
            bg-orange-600
            hover:bg-orange-700
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Upload File
        </Link>

      </div>

      <div className="bg-white rounded-3xl border shadow-sm">

        {customer.CustomerFile.length === 0 ? (

          <div className="py-20 text-center">

            <p className="text-slate-500 mb-6">
              No files uploaded yet.
            </p>

            <Link
              href={`/customers/${customer.id}/files/upload`}
              className="
                inline-flex
                bg-orange-600
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              Upload First File
            </Link>

          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b bg-slate-50">

                <th className="text-left p-5">
                  File
                </th>

                <th className="text-left p-5">
                  Type
                </th>

                <th className="text-left p-5">
                  Size
                </th>

                <th className="text-left p-5">
                  Uploaded
                </th>

                <th className="text-right p-5">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {customer.CustomerFile.map((file) => (

                <tr
                  key={file.id}
                  className="border-b"
                >

                  <td className="p-5 font-medium">
                    {file.fileName}
                  </td>

                  <td className="p-5">
                    {file.fileType}
                  </td>

                  <td className="p-5">
                    {Math.round(file.fileSize / 1024)} KB
                  </td>

                  <td className="p-5">
                    {file.createdAt.toLocaleDateString()}
                  </td>

                  <td className="p-5 text-right space-x-3">

                    <Link
    href={`/api/customer-files/${file.id}`}
    target="_blank"
>
    View
</Link>

<Link
    href={`/api/customer-files/${file.id}?download=1`}
>
    Download
</Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}