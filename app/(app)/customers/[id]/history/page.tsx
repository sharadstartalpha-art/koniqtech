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

        activities:{
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

      {/* Header */}

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
        text-slate-900
        ">
          Customer History
        </h1>

        <p className="text-slate-500 mt-2">
          Complete activity timeline for this customer.
        </p>

      </div>

      {/* Timeline */}

      <div className="
      bg-white
      border
      rounded-3xl
      shadow-sm
      p-8
      ">

        {customer.activities.length===0 ?(

          <div className="
          py-16
          text-center
          text-slate-500
          ">
            No customer activity yet.
          </div>

        ):(
          <div className="space-y-8">

            {customer.activities.map(activity=>(

              <div
                key={activity.id}
                className="
                relative
                pl-8
                border-l-2
                border-orange-200
                "
              >

                <div
                  className="
                  absolute
                  -left-[9px]
                  top-1
                  w-4
                  h-4
                  rounded-full
                  bg-orange-600
                  "
                />

                <h3 className="
                font-semibold
                text-slate-900
                ">
                  {activity.title}
                </h3>

                {activity.description &&(

                  <p className="
                  text-slate-600
                  mt-2
                  ">
                    {activity.description}
                  </p>

                )}

                <p className="
                text-sm
                text-slate-500
                mt-3
                ">
                  {activity.createdAt.toLocaleString()}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>

  )

}