import prisma from "@/shared/lib/prisma"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const {id}=await params

  const activities=
  await prisma.leadActivity.findMany({

    where:{
      leadId:id
    },

    orderBy:{
      createdAt:"desc"
    }

  })

  return(

    <div className="space-y-5">

      <h1 className="text-5xl font-bold">
        Lead Timeline
      </h1>

      {

        activities.map(a=>(

          <div
            key={a.id}
            className="
            bg-white
            border
            rounded-2xl
            p-5
            "
          >

            <h2 className="font-bold">
              {a.title}
            </h2>

            <p className="text-sm text-slate-500">
              {a.createdAt.toLocaleString()}
            </p>

          </div>

        ))

      }

    </div>

  )

}