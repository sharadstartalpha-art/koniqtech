import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}:{
  params:Promise<{
    id:string
  }>
}){

  const session =
    await auth()

  if(!session?.user){
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if(!orgId){
    redirect("/welcome")
  }

  const { id } =
    await params

  const customer =
    await prisma.customer.findFirst({

      where:{
        id,
        orgId
      },

      include:{

        CustomerFile:{
          orderBy:{
            createdAt:"desc"
          }
        }

      }

    })

  if(!customer){
    notFound()
  }

  return(

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href={`/customers/${customer.id}`}
            className="
            inline-flex
            items-center
            gap-2
            text-slate-500
            hover:text-orange-600
            mb-5
            "
          >
            ← Back to Customer
          </Link>

          <h1 className="
          text-4xl
          font-bold
          ">
            Customer Files
          </h1>

          <p className="text-slate-500 mt-2">
            Documents, warranties, manuals and attachments.
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
          rounded-2xl
          "
        >
          Upload File
        </Link>

      </div>

      <div className="
      bg-white
      border
      rounded-3xl
      shadow-sm
      p-8
      ">

        {customer.CustomerFile.length===0 ?(

          <div className="
          text-center
          py-20
          ">

            <h2 className="
            text-2xl
            font-semibold
            ">
              No files uploaded
            </h2>

            <p className="
            text-slate-500
            mt-3
            ">
              Upload contracts, warranties,
              photos or manuals.
            </p>

          </div>

        ):(

          <div className="
          grid
          md:grid-cols-2
          gap-5
          ">

            {customer.CustomerFile.map(file=>(

              <div
                key={file.id}
                className="
                border
                rounded-2xl
                p-5
                "
              >

                <h3 className="font-semibold">
                  {file.fileName}
                </h3>

                <p className="
                text-sm
                text-slate-500
                mt-2
                ">
                  Uploaded on{" "}
                  {file.createdAt.toLocaleDateString()}
                </p>

                <div className="
                flex
                gap-3
                mt-5
                ">

                  <Link
                    href={file.fileUrl}
                    target="_blank"
                    className="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-600
                    text-white
                    "
                  >
                    Download
                  </Link>

                  <Link
                    href={`/customers/${customer.id}/files/${file.id}/delete`}
                    className="
                    px-4
                    py-2
                    rounded-xl
                    border
                    border-red-300
                    text-red-600
                    "
                  >
                    Delete
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}