import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import ContractCalendar from "./ContractCalendar"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const contracts =
    await prisma.contract.findMany({

      where:{
        orgId
      },

      include:{
        customer:{
          select:{
            id:true,
            firstName:true,
            lastName:true
          }
        }
      },

      orderBy:{
        endDate:"asc"
      }

    })

  const events =

    contracts.flatMap(contract=>{

      const customer =
        `${contract.customer.firstName} ${contract.customer.lastName}`

      const items:any[]=[]

      if(contract.startDate){

        items.push({

          title:`🟢 ${customer} • ${contract.title}`,

          start:contract.startDate.toISOString(),

          url:`/customers/${contract.customer.id}/contracts/${contract.id}`

        })

      }

      if(contract.endDate){

        items.push({

          title:`🔴 Ends • ${customer}`,

          start:contract.endDate.toISOString(),

          url:`/customers/${contract.customer.id}/contracts/${contract.id}`

        })

      }

      if(contract.renewalDate){

        items.push({

          title:`🟡 Renewal • ${customer}`,

          start:contract.renewalDate.toISOString(),

          url:`/customers/${contract.customer.id}/contracts/${contract.id}`

        })

      }

      return items

    })

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold">

          Contract Calendar

        </h1>

        <p className="text-slate-500 mt-2">

          Contract starts, expirations and renewals.

        </p>

      </div>

      <div className="bg-white border rounded-3xl p-6">

        <ContractCalendar
          events={events}
        />

      </div>

    </div>

  )

}